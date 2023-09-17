---
title: "CFDBench: A Comprehensive Benchmark for Machine Learning Methods in Fluid Dynamics"
date: 2023-09-16 19:47:17
categories: paper
tags:
- paper
- research
- cfd
- dataset
- "00"
- english
featured: true
---

[Code](https://www.github.com/luo-yining/CFDBench) | [Paper (on hold by ArXiv)](...) | [知乎](https://zhuanlan.zhihu.com/p/656033757)

I did this work with my girlfriend, whose research direction is computational fluid dynamics (CFD). We observed that there are numerous research works in applying deep learning (DL) to solve CFD problems. E.g., [Pangu-Weather](https://github.com/198808xc/Pangu-Weather) have shown that DL methods can not only be more accurate than the best numerical methods, but can also be multiple magnitudes faster.

<!-- more -->

However, there is no standard benchmark for evaluating the performance of different DL methods. Therefore, we constructed CFDBench.

---

## Abstract

In recent years, applying deep learning to solve physics problems has attracted much attention. Data-driven deep learning methods produce operators that can learn solutions to the whole system of partial differential equations. However, the existing methods are only evaluated on simple flow equations (e.g., Burger's equation), and only consider the generalization ability on different initial conditions. In this paper, we construct CFDBench, a benchmark with four classic problems in computational fluid dynamics (CFD): lid-driven cavity flow, laminar boundary layer flow in circular tubes, dam flows through the steps, and periodic Karman vortex street. Each flow problem includes data with different boundary conditions, fluid physical properties, and domain geometry. Compared to existing datasets, the advantages of CFDBench are (1) comprehensive. It contains common physical parameters such as velocity, pressure, and cavity fraction. (2) realistic. It is very suitable for deep learning solutions of fluid mechanics equations. (3) challenging. It has a certain learning difficulty, prompting to find models with strong learning ability. (4) standardized. CFDBench facilitates a comprehensive and fair comparison of different deep learning methods for CFD. We make appropriate modifications to popular deep neural networks to apply them to CFDBench and enable the accommodation of more changing inputs. The evaluation on CFDBench reveals some new shortcomings of existing works and we propose possible directions for solving such problems.
