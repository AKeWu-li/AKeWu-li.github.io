---
title: Markdown
date: 2021-08-19 17:34:22
updated:
tags: ['Markdown']
categories: Base
keywords:
description:
top_img:
comments:
cover:
toc:
toc_number:
toc_style_simple:
copyright:
copyright_author:
copyright_author_href:
copyright_url:
copyright_info:
mathjax:
katex:
aplayer:
highlight_shrink:
aside:
abcjs:
noticeOutdate:
---
## 开始
### 编辑器
[Typora](https://www.typora.io/)
[Sublime Text](https://www.sublimetext.com/)
<!-- more -->

### 语法
#### 标题
~~~markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
~~~
#### 字体
~~~markdown
*斜体文本*
_斜体文本_
**粗体文本**
__粗体文本__
***粗斜体文本***
___粗斜体文本___
~ ~删除线文本~ ~
~~~
#### 列表
~~~markdown
* 第一项
* 第二项
* 第三项
+ 第一项
- 第一项
1. 第一项
2. 第二项
3. 第三项
列表嵌套只需在子列表中的选项前面添加四个空格
1. 第一项：
    - 第一项嵌套的第一个元素
    - 第一项嵌套的第二个元素
~~~
#### 区块
~~~markdown
> 最外层
> > 第一层嵌套
> > > 第二层嵌套
~~~
#### 代码
```javascript
$(document).ready(function () {
    alert('RUNOOB');
});
```
#### 链接
~~~markdown
[链接名称](链接地址)
或
<链接地址>
~~~
#### 图片
~~~markdown
![alt 属性文本](图片地址)
![alt 属性文本](图片地址 "可选标题")
表格
| 左对齐 | 右对齐 | 居中对齐 |
| :-----| ----: | :----: |
| 单元格 | 单元格 | 单元格 |
| 单元格 | 单元格 | 单元格 |
~~~
#### 分割线
~~~markdown
***
~~~
#### 高级
~~~markdown
使用 <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Del</kbd> 重启电脑
以下符号前面加反斜杠帮助插入普通符号
\   反斜线
`   反引号
*   星号
_   下划线
{}  花括号
[]  方括号
()  小括号
#   井字号
+   加号
-   减号
.   英文句点
!   感叹号
~~~
## 结束