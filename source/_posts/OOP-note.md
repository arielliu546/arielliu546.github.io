---
title: OOP note
date: 2025-02-24 08:42:52
tags:
---
宏定义：防止头文件被重复包含->后续struct、class等定义时，多次包含头文件会导致重复定义
```cpp 
#ifndef __BODYDEF_H__
#define __BODYDEF_H__ 
 // 头文件内容 
#endif
```

```cpp
#pragma once
// 头文件内容
```

# 函数重载：  
## 使用场景：  
函数名相同, 
- *输入类型不同*   
`sum(int a, int b);
sum(double a, double b);`   
- *存储形式不同*   
`sort(const chat* s);
sort(string str);`  
- *相似任务，在抽象概念层面一致：*    
在抽象层面，这些函数执行的是同一种概念上的任务，但具体实现可能不同。例如：
  - `print("Hello")`（在屏幕上显示）
  - `printToFile("Hello")`（将内容保存到文件）
  - `printToPrinter("Hello")`（打印到纸上）
  - 这些操作本质上都属于“输出”这个概念，因此可以用相同的函数名 print() 进行重载，让调用方式统一。

## 类型转换
基本条件：保证至少一个函数**参数类型**有区别（返回值不能作为区分）  
当函数重载时，会*优先调用*类型匹配的函数实现，否则才会进行类型转换    
若调用的*实参*与*形参*类型不同，且两种数据类型可以进行自动类型转换，则实参会被自动转换为形参    
**自动类型转换也可以通过定义的类型转换运算符来完成（之后会讲）**    

## 缺省值
与C不同，C++支持函数缺省值，放在没有缺省值的参数之后出现
注意二义性

# auto
1. 根据上下文自动判断变量类型
2. 追踪返回类型
``` cpp
auto func(char* ptr, int val) -> int;
```

- 在编译期确定类型。  
- 变量必须在定义时初始化，因为编译器需要根据初始化值来推断变量的类型。
`auto a // wrong` 
- 一个auto对一个类型
`auto b4 = 0, b5 = 20.0 // wrong`
- 函数参数不能auto
- 不能用`sizeof()`

## decltype (declare type)

重用匿名类型
``` cpp
struct { int d ; 
    double b; 
} anon_s; //没有名字的结构体，定义了一个变量
int main() {
    decltype(anon_s) as ;
       //定义了一个上面匿名的结构体...
}
```
vs. `typedef struct { int d ; double b; } anon_s;`

## auto + decltype 自动追踪返回类型
可以推导返回类型（C++11）
``` cpp
auto func(int x, int y) -> decltype(x+y)
{
    return x+y;
}
```

C++14中不再需要显式指定返回类型
``` cpp
auto func(int x, int y)
{
    return x+y;
}
```

```cpp
template <typename _Tx, typename _Ty> 
auto multiply(_Tx x, _Ty y)->decltype(x*y)
    //C++11语法，C++14可省略"->"和decltype
{ 
    return x*y; 
}
//使用时
auto a = multiply(2, 3.3); //a=6.6
```

# 内存申请与释放
``` cpp
int * ptr = new int(10); // 单个变量
int * array = new int[10]; // 10元素数组
delete ptr; // 删除指针变量所指单个内存单元
delete[] array; // 删除多个单元组成的内存块 
```

# 零指针 nullptr

# 基于范围的for循环 ：

# OOP
## 封装
封装 = {属性/数据，服务/函数} 

## 类 class
### 定义
``` cpp
// matrix.h
#ifndef MATRIX_H
#define MATRIX_H

class Matrix {
    int data[6][6];
public:
    void fill(char dir);
};

#endif 
```
```cpp
class Matrix {
public:
    void fill(char dir) { 
        ...;  //在类内定义成员函数
    }
    ...
}; // <1>
---------------------------------------------
void Matrix::fill(char dir) {
    ... ;		//在类外定义成员函数
} // <2>
```
一般在类外定义

### 访问权限
- public: 类内、类外、派生类均可访问
- protected: 类内、派生类均可访问
- private: 类内可访问

``` cpp
// matrix.h
class Matrix {
public:
    void fill(char dir);
private:
    int data[6][6];
}; // <1>
//或者
class Matrix {
    int data[6][6]; // class中成员的缺省属性为private
public:
    void fill(char dir);
}; // <2>
```
访问：
``` cpp
// main.cpp
#include "matrix.h"		// Matrix类的声明
int main()
{
    Matrix obj;		// 定义变量（对象）
    obj.fill('u');   	// 访问公有成员
    obj.data[1][1] = 23; 	// ERROR!
    return 0;
}
```

### this
指向当前对象的指针
``` cpp
class Matrix {
public:
    void fill(char dir) {
        this->data[1][1] = 23; // this->data[1][1] == data[1][1]
    }
};
```

### 内联函数
```cpp
int max(int a, int b) {
    return a > b ? a : b;
}
\\ compare:
cout << max(a, b) << endl;
cout << (a > b ? a : b) << endl;

\\ use inline 
inline int max(int a, int b) { 
    return a > b ? a : b; 
}
cout << max(a, b) << endl;
\\ is the same as 
cout << (a > b ? a : b) << endl;
```
内联修饰符更像是建议而不是命令。

编译器“有权”拒绝不合理的请求，例如编译器认为某个函数不值得内联，就会忽略内联修饰符。

编译器会对一些没有内联修饰符的函数，自行判断可否转化为内联函数，一般会选择短小的函数。

