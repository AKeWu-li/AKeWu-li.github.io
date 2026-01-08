---
title: Tomcat
date: 2021-09-30 18:26:31
tags: ['Tomcat']
---
## 开始
### [安装](https://blog.csdn.net/weixin_45193229/article/details/114323970)
```language
注意JDK版本与Tomcat版本
```
#### 通过startup.bat启动时窗口出现乱码
```language
命令行输入chcp(显示"活动代码页: 936"则表示系统编码格式为GB2312编码)
打开文件D:\apache-tomcat-8.5.64-windows-x64\apache-tomcat-8.5.64\conf\logging.properties
查找java.util.logging.ConsoleHandler.encoding
将UTF-8改成GBK
```
注：在IDEA文件编码格式中也要一致，否则运行中出现乱码

<!-- more -->

#### 测试
```
localhost:8080
```
### [配置](https://blog.csdn.net/qq_43487456/article/details/110123493)

IDEA2020创建JavaWeb工程，需要注意如下方面
```language
1.编辑配置Tomcat部署栏添加构建
2.项目结构中库(Libraries)添加Tomcat安装位置下lib文件夹中servlet-api.jar包(Maven项目不需要)
3.新建servlet添加映射路径(例：@WebServlet(name = “Servlet”,urlPatterns = “/Servlet”))
4.如需配置图片文件夹，在Deployment中添加External Source即可
```

## 结束