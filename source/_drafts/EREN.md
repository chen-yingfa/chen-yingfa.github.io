---
author: 陈英发 Yingfa Chen
title: "(EREN) Robust and Scalable Model Editing for Large Language Models"
date: 2023-09-14 19:39:34
categories: Paper
tags:
- paper
- arxiv
- llm
- knowledge
- research
- emnlp
- english
- model editing
- in-context-learning
- ai
- serac
- rome
- eren
- mend
featured: true
---

This is my first ever stand-alone research work, I hope it can be accepted at EMNLP 2023, but judging from its review scores, it can only get EMNLP Findings. But that's acceptable.

<!-- more -->

> The first reviewer actually lowered the "soundness" score after rebuttal! WHY!

[OpenReview link](https://openreview.net/forum?id=vDUsGqCIyb&noteId=K2D6oCGNlE)

> TLDR: A reader is augmented with a growing notebook that caches all edits in natural texts, and the reader retrieves relevant edits and make inference based on them. This achieves SOTA in model editing in QA and fact-checking.

---

<strong>Abstract</strong>
<div style="text-align: justify;">
The memorized knowledge of large language models (LLMs) may not be consistent with that of the real world, and the model may produce undesired behaviors or incorrect predictions. Therefore, there is a need for model editing, i.e., modifying the behavior of an LLM on specific examples while preserving its performance on unrelated instances. Existing LLM editing methods modify the behavior by adding a prompt to the input, which is not scalable due to the limited length of the prompt and may negatively affect the performance on unrelated instances. In this paper, we propose EREN (Edit models by REading Notes) to improve the scalability and robustness of LLM editing. Specifically, EREN complements the LLM with a notebook that contains all edits in natural text and retrieves the relevant edits for a given input. To avoid the negative effect of irrelevant edits, we propose a two-step reading comprehension procedure to determine whether there is a relevant edit for the input. If not found, the LLM will make predictions directly. Empirical results on question-answering and fact-checking show that our method outperforms current state-of-the-art methods by a large margin. Unlike existing techniques, it can integrate knowledge from multiple edits, and correctly respond to syntactically similar but semantically unrelated inputs (and vice versa).
</div>

## Introduction

...

