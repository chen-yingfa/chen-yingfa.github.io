---
title: About me
date: 2023-09-14 18:18:06
updated: 2023-09-16 20:11:00
type: "about"
---

[中文](#Chinese-Version-中文版本)

Social links:

- [Google Scholar](https://scholar.google.com/citations?user=IgPWvEQAAAAJ&hl=en)
- [Twitter](https://www.twitter.com/DonnyChan123)
- [GitHub](https://www.github.com/chen-yingfa)
- [知乎](https://www.zhihu.com/people/chen-ying-fa-34)
- [B站](https://space.bilibili.com/474619698?spm_id_from=333.1007.0.0)

Email: (either is ok)

- chenyingfa1999@qq.com
- donnychan1999@gmail.com

---

你好, hello, hei!

My name is Yingfa Chen (陈英发).

I'm a 2nd year graduate student at the [Natural Language Processing lab at Tsinghua University](http://nlp.csai.tsinghua.edu.cn/), advised by Prof. Zhiyuan Liu. My research interests are about controlling the knowledge and behavior of large language models.

I'm just getting started with academia, and will be applying for PhD in the same lab this year (the end of 2023), there is so much to learn!

[:page_facing_up: My CV (last updated: December, 2022)](/pdf/cv.pdf)

## Education

- **M.S. in Computer Science and Technology (计算机科学与技术)**
    
    Tsinghua University, China
    
    Sep 2022 - Jul 2024 (expected)

    *Research direction: natural language processing, large language models*

    *Advisor: Prof. Zhiyuan Liu*


- **B.S. in Computer Science and Technology (计算机科学与技术)**

    Tsinghua University, China 
    
    Aug 2018 - Jul 2022


- **General Studies in Natural Science (Studiespesialisering med realfag)**

    Møglestu High School, Norway

    Aug 2014 - Jul 2018

## Personal Background

I was born in March 13, 1999 in Arendal Norway. I grew up in Lillesand, a small coastal town in Aust-Agder, Norway. My parents are ethnically Chinese but born respectively in Vietnam and Cambodia, and they moved to Norway as refugees. My mother tongue is Cantonese Chinese.

When I was 19, I went to Beijing for a Bachelor's degree in Computer Science at Tsinghua University.

Since March of 2022, I am happily in a relationship with [Luo Yining](https://www.github.com/luo-yining/).

## Interests

:muscle: Sports: Badminton, running, soccer.

:video_game: Entertainment: Video games, C-pop, anime, manga, Jackie Cheung, etc.

---

> Below is the Chinese version of this text, no need to read it if you understand the above text already.

## Chinese Version 中文版本

我叫陈英发。

我是清华大学[自然语言处理与社会人文计算实验室](http://nlp.csai.tsinghua.edu.cn/)的二年级研究生，由刘知远副教授指导。我的研究兴趣是关于控制大型语言模型的知识和行为。

我刚刚开始学术生涯，将在今年（2023年低）申请博士学位，还有很多要学习！

[:page_facing_up: 我的简历（最后更新：2022年12月）](/pdf/cv.pdf)

### 教育背景

- **硕士：计算机科学与技术**

    清华大学，中国

    2022年9月 - 2024年7月（预计）

    研究方向：自然语言处理，大型语言模型

    导师：刘知远副教授


- **本科：计算机科学与技术**

    清华大学，中国

    2018年8月 - 2022年7月


- **高中：自然科学通识教育**

    挪威，莫格勒斯图高中

    2014年8月 - 2018年7月

### 个人背景

我于 1999 年 3 月 13 日在挪威 Arendal 出生。我长大在挪威 Aust-Agder 的一个沿海小镇 Lillesand。我的父母是华裔，分别出生在越南和柬埔寨，他们作为难民移民到挪威。我的母语是广东话。

十九岁时，我前往北京，在清华大学攻读计算机科学学士学位。

自 2022 年 3 月以来，我与我女友[骆怡宁](https://www.github.com/luo-yining/)相爱。

### 兴趣爱好

:muscle: 体育：羽毛球，跑步，足球。

:video_game: 娱乐：电子游戏，C-pop，动漫，漫画，张学友等等。

> Translated by ChatGPT, reviewed by me.

---

## Extra

Here is a binary search in Python:

```python
def bin_search(arr: list, target) -> int:
    lo, hi = 0, len(arr)
    while lo < hi:
        m = (lo + hi) // 2
        if arr[m] < target:
            lo = m + 1
        else:
            hi = m
    return lo
```
