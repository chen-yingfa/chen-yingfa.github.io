---
title: "Safety and Ethical Concerns in Large Language Models"
date: 2023-09-19 18:13:06
categories:
tags:
- english
- research
- llm
- machine-learning
- ethics
- safety
- ai alignment
- 面壁智能
- modelbest
- life
---

I will be holding a seminar at ModelBest (面壁智能) in Sep 20, 2023 in Beijing, Haidian, 科技园. The seminar will be in Chinese, and it's called "大模型安全与伦理问题". Below is a list of references.

<!-- more -->

## Introduction

- Galactica: A Large Language Model for Science
- https://openai.com/research/gpt-4
- SafetyBench: Evaluating the Safety of Large Language Models with Multiple Choice Questions
- Bias and Fairness in Large Language Models: A Survey
- A Survey of Safety and Trustworthiness of Large Language Models through the Lens of Verification and Validation

## Evaluation Methods

- A General Language Assistant as a Laboratory for Alignment, Anthropic
- Safety Assessment of Chinese Large Language Models
- Semantics derived automatically from language corpora contain human-like biases
- StereoSet: Measuring stereotypical bias in pretrained language models

### Instruction Attacks

- Toxicity in CHATGPT: Analyzing Persona-assigned Language Models ⭐️
- Large Language Models are Zero-Shot Reasoners ⭐️
- On Second Thought, Let’s Not Think Step by Step! Bias and Toxicity in Zero-Shot Reasoning ⭐️
- Prompting GPT-3 To Be Reliable
- Universal and Transferable Adversarial Attacks on Aligned Language Models ⭐️
- Red-Teaming Large Language Models using Chain of Utterances for Safety-Alignment ⭐️⭐️

### Exaggerated Safety

- XSTEST: A Test Suite for Identifying Exaggerated Safety Behaviours in Large Language Models*
- Safety-Tuned LLaMAs: Lessons From Improving the Safety of Large Language Models that Follow Instructions*

## Alignment Methods

- Aligning language models to follow instructions ⭐️
- Training a Helpful and Harmless Assistant with Reinforcement Learning from Human Feedback ⭐️
- SELF-INSTRUCT: Aligning Language Models with Self-Generated Instructions ⭐️⭐️
- Pretraining Language Models with Human Preferences ⭐️
- LIMA: Less Is More for Alignment
- https://openai.com/blog/our-approach-to-alignment-research (Aug 2022)
- https://openai.com/blog/our-approach-to-alignment-research (Jul 2023) ⭐️


⭐️: important

⭐️⭐️: very important

## My Thoughts

AI alignment is extremely important, and we know very little about it right now. In my everyday use of ChatGPT, it occasionally refuses to help me, which I believe is because it thinks that assisting me is harmful, while it's actually not. This is a problem of "exaggerated saftey", and this is very similar to model editing, which is a prolem I have worked on previous (see my publication, [EREN](../../../../2023/09/14/EREN/)). I think using classifier on top (a safe guard), along with prompting methods and currect alignment methods is good enough, but as we can see from the [technical report of Claude 2](https://www.anthropic.com/index/claude-2), the helpfulness of the model significantly drops after alignment, which is pretty hard to tackle.

Another concern is that there is no concensus on the goal of alignment. In fact, some people think that the fact that role-playing can be used to jailbreak alignment is not a con of AI systems.

Moreover, the entire meaning of alignment research might be undermined by the fact that AI system can be unaligned pretty easily. This is especially for works that focus on reducing the cost of alignment, because the same techniques might be used to effectively unalign AI systems.

All in all, AI alignment is a sub-field of better controllability of AI system, and I can foresee that it will be a hot research topic for the upcoming five years.
