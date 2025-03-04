---
title: program notes
date: 2025-03-01 09:27:51
tags:
---
# Python
shorthand print list
`print(*list)`
``` python
import sys
input = lambda:sys.stdin.readline().strip()
```

lambda function
``` python
x = lambda a : a + 10
print(x(5))

get_mid = lambda nums: nums[len(nums) // 2] # get middle number
print(get_mid([1, 2, 3, 4, 5]))
```

built-in sort algorithms
``` python
# sorted(iterable, key = None, reverse = False) 
# default: upward order
# returns a new iterable

words = ['apple', 'banana', 'cherry']
print(sorted(words, key=len))

# list.sort (key = None, reverse = False)
# sorts in-place, returns None
words.sort(key=len)
print(words)
```
map
``` python
# map(function, iterable)
# returns a new iterable
# function can be a lambda function
# map(function, iterable1, iterable2, ...) can map multiple iterables

numbers = [1, 2, 3, 4, 5]
squares = map(lambda x: x ** 2, numbers)
print(list(squares))

# map(function, iterable1, iterable2, ...) can map multiple iterables
numbers1 = [1, 2, 3, 4, 5]

numbers2 = [6, 7, 8, 9, 10]

sums = map(lambda x, y: x + y, numbers1, numbers2)
print(list(sums))
```

filter
``` python
# filter(function, iterable)
# returns a new iterable
# function can be a lambda function

numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

evens = filter(lambda x: x % 2 == 0, numbers)
print(list(evens))
```
