---
layout: post
author: Donny Chan
title: 第一篇
date: 2022-10-27 14:04:16 +0800
categories: Life
tags: 
- life
- jekyll
- test
- hugo
- static-site-generator
- 中文
- html
- liquid
---

之前尝试用 Hugo 来部署，发现 Hugo 不仅挺复杂，而且还有很多小问题，可能这就是速度带来的代价吧。但是其实我也不是写很多内容，所以 Jekyll 的速度应该是够用的。

Jekyll 支持在 markdown 内容里面用 Liquid template tags 来生成动态内容，比如根据 front matter 中的 tags，给每个 tag 生成 html div。如下 liquid 语法：

{% raw %}
```html
<div>
{% for tag in site.tags %}
    <a style="background-color: blue;">#{{ tag[0] }}</a>
{% endfor %}
</div>
```
{% endraw %}

<!-- more -->

会根据 post markdown 文件中的 front matter 中定义的 tags：

```markdown
---
tags: some tags here
---
```

生成相应的 html div：

```html
<div class="post-tags">
    <a href="/tags/life" class="tag-card">life</a>
    <a href="/tags/update" class="tag-card">update</a>
    <a href="/tags/learn" class="tag-card">learn</a>
    <a href="/tags/important" class="tag-card">important</a>
    <a href="/tags/jekyll" class="tag-card">jekyll</a>
    <a href="/tags/hugo" class="tag-card">hugo</a>
    <a href="/tags/static-site-generator" class="tag-card">static-site-generator</a>
</div>
```

---

不知道写啥，就写一个 Python 的二分搜索吧：

```python
def bin_search(arr: list, target: Any) -> int:
    '''
    Return the smallest index such that when target is inserted at that index,
    the array will remain sorted.
    '''
    lo, hi = 0, len(arr)
    while lo < hi:
        m = (lo + hi) // 2
        if arr[m] < target:
            lo = m + 1
        else:
            hi = m
    return lo
```