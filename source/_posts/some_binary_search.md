---
title: Some Binary Search
date: 2023-09-14 19:31:09
categories: test
tags:
- algorithm
- binary-search
- rust
- python
- c++
- test
- 中文
---

A binary search with C++:

```c++
template<class T>
int bin_search(vector<T>& arr, T target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = (left + right) / 2;
        if (arr[mid] == target) {
            break;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return left;
}
```

The same thing with Rust:

```rust
fn bin_search<T: Ord>(arr: &Vec<T>, target: &T) -> usize {
    let mut left = 0;
    let mut right = arr.len() - 1;
    while left <= right {
        let mid = (left + right) / 2;
        if arr[mid] == *target {
            break;
        } else if arr[mid] < *target {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    left
}
```

And with Python:

```python
def bin_search(arr: list, target):
    left = 0
    right = len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            break
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return left
```