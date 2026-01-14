---
title: Hexo主题界面美化
subtitle: yilia
date: 2021-09-19 11:07:41
updated:
tags: ['Hexo',"yilia"]
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

### CSS更改

#### [样式参考](https://blog.luzy.top/)

#### [成果参考](https://blog.liiz.top/)

```language
文件目录:myblog\themes\yilia\source\main.0cf68a.css
```

```language
左边侧边栏
.left-col{
侧边栏菜单
.left-col #header .profilepic(头像)
.left-col #header .header-menu(主页菜单)
.left-col #header .header-smart-menu(所有文章等项目菜单)
#header .header-nav .social(社交按钮菜单)
自己添加部分
#header .header-nav .music(网易云音乐)
#poem_sentence(每日一句诗歌)
}
```

```language
右侧文章(註：在2194行)
.article{
文章区域右上角日期
.archive-article-date
文章标题
.article-inner h1.article-title,.article-title
文章右下角展开全文
.article-more-link a
文章下方分割线
.article-info-index.article-info
文章中超链接
.article-entry a
}
回到顶部按钮
.mod-side-operation__jump-to-top .icon-back
.jump-container:hover .icon-back
```

```language
颜色渐变动画
@keyframes gradientBG
淡出淡入动画
@keyframes load_music
横拉动画
@keyframes before_Load_Left_col
@keyframes after_Load_Left_col
缩放动画
@keyframes before_load_article
@keyframes after_load_arricle
```

<!-- more -->
```language
手机端首部背景
#mobile-nav .overlay
手机端部分设置
@media screen and (max-width:800px)
```

##### [打字效果](https://lhammer.cn/You-need-to-know-css/#/zh-cn/typing)
##### [抖动效果](https://lhammer.cn/You-need-to-know-css/#/zh-cn/shake)
##### [边框动画](https://qishaoxuan.github.io/css_tricks/hover/#%E8%BE%B9%E6%A1%86%E5%8A%A8%E7%94%BB)
##### [鼠标点击出现爱心效果](https://blog.csdn.net/qq_43827595/article/details/100177617)
##### [雪花飘落效果](https://blog.csdn.net/weixin_41287260/article/details/103050877?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522163186087316780357272525%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fblog.%2522%257D&request_id=163186087316780357272525&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~first_rank_v2~rank_v29-1-103050877.pc_v2_rank_blog_default&utm_term=hexo&spm=1018.2226.3001.4450)

### BUG

#### 1. Chrome浏览器访问显示三个滚动条

~~~language
调整::-webkit-scrollbar选择器display:none，Chrome浏览器一个滚动条也没有
~~~

#### 2. ~~文章标题抖动~~
在CSS文件的选择器.article-inner h1.article-title,.article-title添加抖动功能,但出现以整一行中心为锚点抖动的情况
目前处理办法(改变锚点)
```language
transform-origin: 5%;
```
***
已解决
```language
display:flex->display: inline-flex;
```

#### 3. 每日一句功能
侧边栏部分
```language
yilia\layout\_partial\left-col.ejs(26-40);
CSS:width: 21ch;->???
```

页脚部分(可不进行修改)
```language
yilia\layout\_partial\footer.ejs(10-11);
```


#### 4. 添加隐藏侧边栏功能
参考文章:[秦时明月之君临天下](https://blog.csdn.net/weixin_41287260/article/details/103050753)
问题在于JavaScript代码无法获取对于CSS选择器
原代码
```JavaScript
<script>
    var hide = false;
    function myFunction(x) {
        x.classList.toggle("change");
        if(hide == false){
            $(".left-col").css('display', 'none');
            $(".mid-col").css("left", 6);
            $(".tools-col").css('display', 'none');
            $(".tools-col.hide").css('display', 'none');
            hide = true;
        }else{
            $(".left-col").css('display', '');
            $(".mid-col").css("left", 300);
            $(".tools-col").css('display', '');
            $(".tools-col.hide").css('display', '');
            hide = false;
        }
    }
</script>
```
改代码
```JavaScript
<script>
    var hide = false;
    function myFunction(x) {
        x.classList.toggle("change");
        if(hide == false){
        document.getElementsByClassName("left-col")[0].style.display="none";
        document.getElementsByClassName("mid-col")[0].style.left="6";
        document.getElementsByClassName("tools-col")[0].style.display="none";
        document.getElementsByClassName("hide")[1].style.display="none";
            hide = true;
        }else{
        document.getElementsByClassName("left-col")[0].style.display="block";
        document.getElementsByClassName("mid-col")[0].style.left="300";
        document.getElementsByClassName("tools-col")[0].style.display="block";
        document.getElementsByClassName("hide")[1].style.display="block";
            hide = false;
        }
    }
</script>
```
改完问题在于document.getElementsByClassName("hide")[1]无法获取CSS选择器
查看网页源代码发现.tools-col.hide类对应HTML代码如下
```language
<div class="tools-col" q-class="show:isShow,hide:isShow|isFalse" q-on="click:stop(e)"></div>
```
仍然无法解决...

## 结束