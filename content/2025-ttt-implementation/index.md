---
author: 陈英发 Yingfa Chen
title: Implementating Test-Time Training - Part 1
date: 2025-03-19 23:56:44
categories:
- Research
tags:
- research
- online-learning
- neural-networks
- language models
- test-time-learning
---

This blog post is part 1 of a series that describes my attempt in implementing the Test-Time Training (TTT) model proposed by [Sun et al. (2024)](https://arxiv.org/abs/2407.04620), and Titans, proposed by [Behrouz et al., (2024)](https://arxiv.org/abs/2501.00663). At the time of writing, these two are two strong recurrent language models, but they have not yet open-sourced their implementation (TTT has only open-sourced the Jax implementation).


<!-- more -->

## Introduction to Test-Time Training

Briefly explained, Test-Time Training (TTT) is an RNN model whose hidden state is replaced with an online learner, whose parameters are updated updated through gradient descent during inference. The goal is that this online learner compress contextual information into its parameters. A TTT operator can be expressed as:

$$
\begin{align*}
\mathbf W_t &= f_\text{update}(k_t, v_t, \mathbf W_{t-1}) \\\\
y_t         &= f_\text{query}(q_t, \mathbf W_t) \in \mathbb R ^d
\end{align*}
$$

where $q_t, k_t, v_t\in\mathbb R^{d}$ are the query, key, and value vectors at time $t$, respectively, $\mathbf W_t$ is the recurrent state *and* the parameters of an online learner. $d$ is a hyperparameter. The function $f_\text{update}$ is the "update rule", and $f_\text{query}$ is the "query rule".

### The Update Rule

The interesting part is that the update rule is implemented with gradient descent:

$$
\mathbf W_t = \mathbf W_{t-1} - \eta_t \frac{\ell(k_t, v_t, \mathbf W_{t-1})}{ \partial \mathbf W_{t-1} } \\\\
$$

where the loss is defined as:

$$
\ell(k_t,v_t,\mathbf W_{t-1}) = \frac 1 2 \Vert f_\text{query}(k_t, \mathbf W_{t-1}) - v_t \Vert ^2_2
$$

In other words, the online learner is learning to produce the value vector $v_t$ when we query it with the key vector $k_t$.

### Mini-Batch Gradient Descent

Obviously, directly running this algorithm is extremely slow because it cannot be parallellized. Sun et al. (2024) proposed *mini-batch gradient descent*, in which the input sequence is split into mini-batches and the gradients are computed based on the online learner's state at the start on mini-batch $\mathbf W_{t'}, t=\text{mod}(t, b)$:

$$
\ell_t = \frac 1 2\Vert f_\text{query}(k_t, \mathbf W_{t'}) - v_t\Vert ^2_2
$$

$$
\mathbf W_t = \mathbf W_{t'} - \eta \sum_{s=t'}^{t} \frac{\partial \ell_s}{\partial \mathbf W_{t'}}
$$

### Dual Form

In order to make make use of matmuls and avoid the materialization of gradients, TTT further proposes to use a "dual form". Without loss of generality, we consider a single mini-batch, where $\mathbf W_0$ is the initial state of the online learner.

### Dual Form of Linear Model

For simplicity, we first explain the dual form for a linear model:

$$
\begin{align*}
\ell_t &= \frac 1 2 \Vert \mathbf W_0 k_t - v_t \Vert _2 ^2 \\\\
\mathbf G_t &= \frac{\partial \ell_t}{\partial \mathbf W_0} = (\hat v_t - v_t)k_t^T \\\\
\mathbf W_t &= \mathbf W_0 - \eta_t \mathbf G_t
\end{align*}
$$

where $\hat v_t=\mathbf W_0 k_t$. We now add in the query vectors and make use of associativity of matrix multiplication to directly compute the output:

$$
\begin{align*}
y_t &= f_\text{query}(q_t, \mathbf W_t)\\\\
 &= \mathbf W_t q_t \\\\
 &= \left(\mathbf W_0 - \eta \sum_{s=1}^t \mathbf G_s\right) q_t \\\\
 &= \mathbf W_0 q_t - \eta \sum_{s=1}^t (\hat v_s-v_s) k_t^T q_t \\\\
\end{align*}
$$

Now, let's define the reconstruction error as $e_t=\hat v_t - v_t$ and $\mathbf E=[e_1, \dots, e_b]$, $\mathbf K=[k_1, \dots, k_b]$, $\mathbf Q=[q_1, \dots, q_b]$. Then we have:

$$
\begin{align*}
\mathbf Y = \mathbf W_0 \mathbf Q - \eta \mathbf E \left(\mathbf M \odot \mathbf K^T \mathbf Q\right) \in \mathbb R^{d\times b}\\\\
\end{align*}
$$

where $\mathbf Y\in\mathbb R^{d\times b}$ is the output matrix, $\mathbf Q, \mathbf K, \mathbf V\in\mathbb R^{d\times b}$ are the query, key, and value matrices, $\mathbf M\in\mathbb R^{b\times b}$ is a mask matrix (upper triangular matrix), and $\odot$ is the element-wise product. We also need the state at the end of the batch, which is simply:

$$
\mathbf W_b = \mathbf W_0 - \eta \mathbf E \mathbf K^T
$$

> It's interesting to see how similar this is to ordinary causal linear attention.

So, to sum up, the dual form of TTT accepts a batch of queries, keys, and values, and online learner state $\left(\mathbf Q, \mathbf K, \mathbf V, \mathbf W\right)$, and returns the output matrix and the state at the end of the batch $\left(\mathbf Y, \mathbf W\right)$. The state at the end of the batch is then used as the initial state for the next batch.

### Dual Form of MLP

The dual form can be extended to a two-layer MLP. The idea is to first apply the dual form to the first layer to get the intermediate representation, and then apply the dual form to the second layer to get the output. The forward pass can be implemented as:

$$
\hat{\mathbf V} = \mathbf K + \mathbf W_2 \cdot \text{ReLU}\left(\mathbf W_1\cdot \mathbf K\right)
$$

Then the gradients are:

$$
\begin{align*}
\mathbf G_{2,t} &= \left(\hat v_i - v_i\right) \cdot \mathbf h^T_i \in \mathbb R^{d\times d_m} \\\\
\mathbf G_{1,t} 
&= \frac{\partial \ell_t}{\partial \mathbf W_1} \\\\
&= \frac{\partial \ell_t}{\partial  h_t} \cdot \frac{\partial h_t}{\partial \mathbf W_1} \\\\
&= \mathbf W_{2,0}^T \left(\hat{v}_t -  v_t\right) \cdot \text{ReLU}'(h_t)\cdot k^T
\end{align*}
$$

Define $g_{h,t}=\mathbf W_{2,0}^T \left(\hat{v}_t -  v_t\right) \cdot \text{ReLU}'(h_t)$, then we can apply dual form the first layer:

$$
\begin{align*}
\mathbf W_{1,t} &= \mathbf W_{1,0} - \eta \sum_{i=1}^t \mathbf G_{1,i}\\\\
&= \mathbf W_{1,0} - \eta \sum_{i=1}^t g_{h,i}  k^T\\\\
\Rightarrow \bar h_t &= \mathbf W_{1,t} q_t \\\\
 &= \mathbf W_{1,0} q_t - \eta \sum_{i=1}^t g_{h,i} k^T q_t\\\\
\Rightarrow \bar{\mathbf H} &= \mathbf W_{1,0} \mathbf Q - \eta \mathbf G_{h} \left(\mathbf M \odot \mathbf K^T \mathbf Q\right) \in \mathbb R^{d_m\times b}
\end{align*}
$$
where $\bar{\mathbf H}$ is the intermediate representation when querying the updated state. Since this is the input query for the second layer, we can apply the dual form to the second layer as if it were a linear model:

$$
\begin{align*}
\mathbf Y &= \mathbf W_{2,0} \bar{\mathbf H} - \eta \mathbf E \left(\mathbf M \odot\mathbf H^T \bar{\mathbf H}\right) \in \mathbb R^{d\times b}
\end{align*}
$$

The state at the end of the batch should be trivial to compute.

## Code Implementation

### Existing Open-Source Implementation

I have found an excellent [PyTorch implementation of Titans by lucidrains](https://github.com/lucidrains/titans-pytorch). Titans is an extension of TTT that adds in momentum-based learning and data-depdendent weight decay and learning rate. However, in this implementation, the memory query is performed on the memory at the start of the batch:
$$
y_t = f_\text{query}(q_t, \mathbf W_{t'})
$$
instead of querying the state after KV insertion $\mathbf W_t$. Not only does this make the implementation much simpler and faster, it also allows for the use of PyTorch's autograd engine (specifically the `grad` and `functional_call` functions) to avoid explicitly writing the gradient computation.

However, this is still not exactly the same as the TTT. So, I will try to implement the original TTT model.

### My Implementation

It should be pretty straightforward to implement the dual form for a two-layer MLP, which is what I will do. Assume that the online learner is defined as:

$$
f_\text{query}(q, \mathbf W) = q + \mathbf W_2 \cdot \text{ReLU}\left(\mathbf W_1\cdot  q \right)
$$

The forward pass can be implemented as:

```python
def two_layer_mlp_dual_form(
    q: Tensor,
    k: Tensor,
    v: Tensor,
    weights: dict[str, Tensor] | None = None,
) -> tuple[dict[str, Tensor], Tensor]:
    """
    This operator utilizes the dual form of TTT (https://arxiv.org/pdf/2407.04620)
    to avoid materializing the gradients.
    """
    device = q.device
    batch_size = q.shape[0]
    w1 = weights["w1"]
    w2 = weights["w2"]

    # forward pass
    h = einsum(w1, k, "dm d, b d -> b dm")  # (b, dh)
    h_relu = torch.relu(h)  # (b, dh)
    h2 = einsum(w2, h_relu, "d dm, b dm -> b d")
    pred = h2 + k  # (b, d)

    # Backward pass
    # We first compute the gradients w.r.t. to the activations,
    # which can be efficiently computed because they utilize
    # backward matmuls.
    grad = pred - v  # (b, d)
    grad_h2 = einsum(w2, grad, "dy dh, b dy -> b dh")
    grad_h = grad_h2 * (h_relu > 0).float()

    # Then, we avoid materializing the gradients w.r.t. the two linear layers
    # W1 and W2, by associativity with the queries.
    mask = torch.triu(
        torch.ones(batch_size, batch_size, requires_grad=False, device=device),
    )
    attn_scores = einsum(k, q, 'bk dk, bq dk -> bk bq')  # (b, b)
    attn_scores = attn_scores * mask  # (b, b)
    h_q = einsum(w1, q, 'dm d, b d -> b dm')
    h_q = h_q - einsum(grad_h, attn_scores, 'bk dm, bk bq -> bq dm')
    h2_q = torch.relu(h_q)  # (b, dm)

    # Compute the output
    attn_scores = einsum(h_relu, h2_q, 'bk dm, bq dm -> bk bq')
    attn_scores = attn_scores * mask
    y = einsum(w2, h2_q, 'd dm, b dm -> b d')
    y = y - einsum(grad, attn_scores, 'bk d, bk bq -> bq d')
    y = y + q  # Residual connection

    # Compute the weights at the end of the batch
    grad_w1 = einsum(grad_h, k, "b dh, b dx -> dh dx")
    w1 = w1 - grad_w1
    grad_w2 = einsum(grad, h_relu, "b dy, b dh -> dy dh")
    w2 = w2 - grad_w2
    weights = {
        'w1': w1,
        'w2': w2,
    }
    return y, weights

```

## How to Cite

```bibtex
@misc{chen2025ttt-implementation,
    author = {Yingfa Chen},
    title = {Implementating Test-Time Training - Part 1},
    year = {2025},
    url = {https://chen-yingfa.github.io/2025/03/19/ttt-implementation/},
}
```

# References

- Test-Time Training. 2024. https://arxiv.org/abs/2407.04620.
- Titans. 2024. https://arxiv.org/abs/2501.00663.
- PyTorch Implementation of Titans by lucidrains. https://github.com/lucidrains/titans-pytorch.

