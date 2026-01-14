---
title: MyBatis
date: 2021-11-16 21:07:08
updated:
tags: ["Mybatis"]
categories: Java
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

### [新建Maven项目](https://www.cnblogs.com/zzvar/articles/14596785.html)

_添加配置项信息_

```language
DarchetypeCatalog=internal
```

_新建文件夹进行关联_

```language
src/main/java -> Sources Root
src/main/resources -> Resources Root
src/test/java -> Test Sources Root
src/test/resources -> Test Resources Root
```

<!-- more -->

### 添加相关依赖

```language
<!--mybatis-->
<dependency>
  <groupId>org.mybatis</groupId>
  <artifactId>mybatis</artifactId>
  <version>3.4.6</version>
</dependency>
<!--数据库相关 jar 包-->
<dependency>
  <groupId>org.mariadb.jdbc</groupId>
  <artifactId>mariadb-java-client</artifactId>
  <version>2.3.0</version>
</dependency>
```

### 数据库配置文件

```language
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>
    <!-- 环境配置 -->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <!-- 数据库连接相关配置 -->
            <dataSource type="POOLED">
                <property name="driver" value=""/>
                <property name="url" value=""/>
                <property name="username" value=""/>
                <property name="password" value=""/>
            </dataSource>
        </environment>
    </environments>
    <!-- 映射文件路径配置 -->
    <mappers>
        <mapper resource=""/>
    </mappers>

</configuration>
```

### 映射文件

```language
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
 	PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
 	"http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="">
	<select id="">
	</select>
	<insert id="">
	</insert>
	<update id="">
	</update>
	<delete id="">
	</delete>
</mapper>
```



## 结束

