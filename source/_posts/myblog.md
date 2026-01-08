---
title: MyBlog
date: 2021-08-19 17:34:24
tags: ['Hexo',"GitHub"]
---
参考文章:[hexo+github](https://blog.csdn.net/wapchief/article/details/54602515?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522162935875116780366584586%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=162935875116780366584586&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduend~default-2-54602515.first_rank_v2_pc_rank_v29&utm_term=hexo%E6%90%AD%E5%BB%BA%E4%B8%AA%E4%BA%BA%E5%8D%9A%E5%AE%A2%E7%BD%91%E7%AB%99&spm=1018.2226.3001.4187).

## 开始

### 注册域名

### 创建仓库

### 安装[nodejs](https://nodejs.org/en/)

验证安装是否成功(其中npm为安装nodejs时附带,git安装自行百度)
``` bash
$ node -v
$ npm -v
$ git --version
```

### 安装Hexo

``` bash
$ npm install hexo-cli -g
$ hexo -v
```

### [初始化Hexo](https://blog.csdn.net/sinat_37781304/article/details/82729029)

新建文件夹myblog，右键git bash here
``` bash
$ hexo init
$ npm install
$ hexo g
$ hexo s
```
此时在浏览器输入localhost:4000就可以看到生成的博客页面

### 修改内容
参考[官方文档](https://hexo.io/zh-cn/docs/)
注意需要如下修改
``` bash
deploy:
  type: git
  repo: https://github.com/Alucard-9/Alucard-9.github.io.git
  branch: main
```

### 部署项目
``` bash
安装部署工具，方便以后更新
$ npm install hexo-deployer-git -save
初始化本地仓库
$ git init
连接远程仓库
$ git remote add origin https://github.com/Alucard-9/Alucard-9.github.io.git
发布hexo到github page(清空、刷新、部署)
$ hexo clean && hexo g && hexo d
```
<!-- more -->
### Github Pages[设置](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
### 域名解析
## 结束
### 设置yilia背景
[甦傑](https://blog.csdn.net/qq_45857922/article/details/113545469?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_title~default-0.control&spm=1001.2101.3001.4242)
[秦时](https://blog.csdn.net/weixin_41287260/article/details/103050813)
(註：article在2029行)
### [设置鼠标点击出现爱心效果](https://blog.csdn.net/qq_43827595/article/details/100177617)
### [背景雪花飘落效果](https://blog.csdn.net/weixin_41287260/article/details/103050877?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522163186087316780357272525%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fblog.%2522%257D&request_id=163186087316780357272525&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~first_rank_v2~rank_v29-1-103050877.pc_v2_rank_blog_default&utm_term=hexo&spm=1018.2226.3001.4450)
### [Github图床设置](https://blog.csdn.net/allen_csdns/article/details/103389093)
### [文章置顶](https://blog.csdn.net/weixin_41287260/article/details/97693850)
### [添加评论](https://blog.csdn.net/qq_43827595/article/details/101450966?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522163015460316780271581026%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fblog.%2522%257D&request_id=163015460316780271581026&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~first_rank_v2~rank_v29-5-101450966.pc_v2_rank_blog_default&utm_term=hexo&spm=1018.2226.3001.4450)