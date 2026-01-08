---
title: SSM框架实现增加、删除、查询、分页显示功能
date: 2021-12-10 20:13:55
tags: ["Mybatis","Spring","Spring MVC"]

---

## 开始

### 项目目录

![工程目录图片](project-directory.png)

### [搭建SSM框架](https://blog.csdn.net/yeyazhishang/article/details/86650053?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_baidulandingword~default-0.highlightwordscore&spm=1001.2101.3001.4242.1)

#### pom.xml

_主要描述项目的maven坐标，依赖关系，开发者需要遵循的规则，缺陷管理系统，组织和licenses，以及其他所有的项目相关因素。_

<!-- more -->

```xml
<properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>1.7</maven.compiler.source>
        <maven.compiler.target>1.7</maven.compiler.target>

        <srping.version>4.0.2.RELEASE</srping.version>
        <mybatis.version>3.2.8</mybatis.version>
        <slf4j.version>1.7.12</slf4j.version>
        <log4j.version>1.2.17</log4j.version>
        <druid.version>1.0.9</druid.version>

    </properties>

    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.11</version>
            <scope>test</scope>
        </dependency>

        <!-- spring框架包 -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-test</artifactId>
            <version>${srping.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-core</artifactId>
            <version>${srping.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-oxm</artifactId>
            <version>${srping.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-tx</artifactId>
            <version>${srping.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>${srping.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-aop</artifactId>
            <version>${srping.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>${srping.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context-support</artifactId>
            <version>${srping.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-expression</artifactId>
            <version>${srping.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-orm</artifactId>
            <version>${srping.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-web</artifactId>
            <version>${srping.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>${srping.version}</version>
        </dependency>
        <!-- spring框架包 -->
        <!-- mybatis框架包 -->
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>${mybatis.version}</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
            <version>1.2.2</version>
        </dependency>
        <!-- mybatis框架包 -->
        <!-- 数据库驱动 -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.35</version>
        </dependency>
        <!-- 导入dbcp的jar包，用来在applicationContext.xml中配置数据库 -->
        <dependency>
            <groupId>commons-dbcp</groupId>
            <artifactId>commons-dbcp</artifactId>
            <version>1.4</version>
        </dependency>
        <!-- jstl标签类 -->
        <dependency>
            <groupId>jstl</groupId>
            <artifactId>jstl</artifactId>
            <version>1.2</version>
        </dependency>
        <!-- log -->
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>${log4j.version}</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
            <version>${slf4j.version}</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-log4j12</artifactId>
            <version>${slf4j.version}</version>
        </dependency>
        <!-- 连接池 -->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>${druid.version}</version>
        </dependency>
        <!-- 文件上传 -->
        <dependency>
            <groupId>commons-fileupload</groupId>
            <artifactId>commons-fileupload</artifactId>
            <version>1.3.3</version>
        </dependency>
        <dependency>
            <groupId>commons-io</groupId>
            <artifactId>commons-io</artifactId>
            <version>2.4</version>
        </dependency>


    </dependencies>
```

#### log4j.properties

```properties
#日志输出级别
log4j.rootLogger=debug,stdout,D,E

#设置stdout的日志输出控制台
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
#输出日志到控制台的方式，默认为System.out
log4j.appender.stdout.Target = System.out
#设置使用灵活布局
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
#灵活定义输出格式
log4j.appender.stdout.layout.ConversionPattern=%d{yyyy-MM-dd HH:mm:ss,SSS} -[%p]  method:[%c (%rms)] - %m%n
```

#### jdbc.properties

_数据库配置文件，设置数据库连接信息。_

```properties
driver=com.mysql.jdbc.Driver
url=jdbc:mysql://localhost:3306/j2ee?characterEncoding=utf8&useSSL=false
username=J2EE
password=lz2001031910167
#定义初始连接数
initialSize=0
#定义最大连接数
maxActive=20
#定义最大空闲
maxIdle=20
#定义最小空闲
minIdle=1
#定义最长等待时间
maxWait=60000
```

#### applicationContext.xml

_Spring配置文件，借助IOC创建对象，引入数据库配置文件采用数据库连接池进行连接，实现MyBatis映射文件的扫描。_

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:tx="http://www.springframework.org/schema/tx" xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                        http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
                        http://www.springframework.org/schema/tx
                        http://www.springframework.org/schema/tx/spring-tx.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">

    <!-- 加载properties文件 -->
    <bean id="propertyConfigurer" class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
        <property name="location" value="classpath:jdbc.properties"/>
    </bean>

    <!-- 配置数据源 -->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="driverClassName" value="${driver}"/>
        <property name="url" value="${url}"/>
        <property name="username" value="${username}"/>
        <property name="password" value="${password}"/>
    </bean>

    <!-- mybatis和spring完美整合，不需要mybatis的配置映射文件 -->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource"/>
        <!-- 扫描model包 -->
        <property name="typeAliasesPackage" value="com.pojo"/>
        <!-- 扫描sql配置文件:mapper需要的xml文件-->
        <property name="mapperLocations" value="classpath:mapping/*.xml"/>
    </bean>

    <!-- Mapper动态代理开发，扫描dao接口包-->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <!-- 注入sqlSessionFactory -->
        <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"/>
        <!-- 给出需要扫描Dao接口包 -->
        <property name="basePackage" value="com.dao"/>
    </bean>

    <!-- 事务管理 -->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <!--数据库连接池-->
        <property name="dataSource" ref="dataSource"/>
    </bean>

</beans>
```

#### spring-mvc.xml

_Spring MVC的配置文件，实现控制器的扫描和视图解析器的配置等操作。_

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/mvc
       http://www.springframework.org/schema/mvc/spring-mvc-3.0.xsd">

    <!-- 扫描注解，这样com.xjt包下的文件都能被扫描 -->
    <context:component-scan base-package="com"/>

    <!-- 开启SpringMVC注解模式 -->
    <mvc:annotation-driven/>

    <!-- 静态资源默认servlet配置 -->
    <mvc:default-servlet-handler/>

    <!-- 配置返回视图的路径，以及识别后缀是jsp文件 -->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="viewClass" value="org.springframework.web.servlet.view.JstlView"/>
        <property name="prefix" value="/WEB-INF/jsp/"/>
        <property name="suffix" value=".jsp"/>
    </bean>
    <!-- 文件上传配置 -->
    <bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
        <!-- 设定默认编码 -->
        <property name="defaultEncoding" value="UTF-8"> </property>
        <!-- 设定文件上传的最大值2MB， 2*1024*1024 -->
        <property name="maxUploadSize" value="2097152"> </property>
    </bean>

</beans>
```

#### web.xml

_实现Spring的加载和Spring MVC前端控制器的配置以及编码自动转换过滤器等配置。_

```xml
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">

    <display-name>Archetype Created Web Application</display-name>
    <!--项目的欢迎页，项目运行起来后访问的页面-->
    <welcome-file-list>
        <welcome-file>index.jsp</welcome-file>
    </welcome-file-list>

    <!-- 注册ServletContext监听器，创建容器对象，并且将ApplicationContext对象放到Application域中 -->
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>

    <!-- 指定spring核心配置文件 -->
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:applicationContext.xml</param-value>
    </context-param>

    <!-- 解决乱码的过滤器 -->
    <filter>
        <filter-name>CharacterEncodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>utf-8</param-value>
        </init-param>

        <init-param>
            <param-name>forceEncoding</param-name>
            <param-value>true</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>CharacterEncodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <!-- 配置前端控制器 -->
    <servlet>
        <servlet-name>springmvc</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <!-- 指定配置文件位置和名称 如果不设置,默认找/WEB-INF/<servlet-name>-servlet.xml -->
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:spring-mvc.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
        <async-supported>true</async-supported>
    </servlet>

    <servlet-mapping>
        <servlet-name>springmvc</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>

</web-app>
```

### 配置Tomcat

### [实现分页显示](https://www.freesion.com/article/15511054391/)

### [实现文件上传](https://www.cnblogs.com/yiyfang/p/14218804.html)

#### Commodity.java

_数据库表对应的映射类_

```java
package com.pojo;

public class Commodity {
    private int id;
    private String name;
    private double price;
    private int remainNumber;
    private int soldOutNumber;
    private String description;
    private String picture;

    public void setId(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getPrice() {
        return price;
    }

    public void setRemainNumber(int remainNumber) {
        this.remainNumber = remainNumber;
    }

    public int getRemainNumber() {
        return remainNumber;
    }

    public void setSoldOutNumber(int soldOutNumber) {
        this.soldOutNumber = soldOutNumber;
    }

    public int getSoldOutNumber() {
        return soldOutNumber;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public String getPicture() {
        return picture;
    }
}
```

#### PageInfo.java

```java
package com.pojo;

import java.util.List;

public class PageInfo<T>
{
    private int totalCount;  //总数量
    private int size;        //每页显示数量
    private int totalPage;   //总页数
    private int currentPage; //当前页
    private List<T> list;    //当前页显示

    public List<T> getList()
    {
        return list;
    }

    public void setList(List<T> list)
    {
        this.list = list;
    }

    public int getTotalCount()
    {
        return totalCount;
    }

    public void setTotalCount(int totalCount)
    {
        this.totalCount = totalCount;
    }

    public int getSize()
    {
        return size;
    }

    public void setSize(int size)
    {
        this.size = size;
    }

    public int getTotalPage()
    {
        return totalPage;
    }

    public void setTotalPage(int totalPage)
    {
        this.totalPage = totalPage;
    }

    public int getCurrentPage()
    {
        return currentPage;
    }

    public void setCurrentPage(int currentPage)
    {
        this.currentPage = currentPage;
    }

    @Override
    public String toString()
    {
        return "PageInfo{" +
                "list=" + list +
                ", totalCount=" + totalCount +
                ", size=" + size +
                ", totalPage=" + totalPage +
                ", currentPage=" + currentPage +
                '}';
    }
}
```

#### CommodityDao.java

_操作数据库的接口_

```java
package com.dao;

import com.pojo.Commodity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface CommodityDao {
    List<Commodity> selectAll();
    List<Commodity> selectAllLimit(@Param("start") int start, @Param("size")int size);
    Commodity selectByPrimaryKey(int id);
    List<Commodity> selectByName(String name);
    boolean insert(Commodity commodity);
    boolean deleteByPrimaryKey(int id);
}
```

#### CommodityMapper.xml

_MyBatis映射文件_

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="com.dao.CommodityDao" >
    <resultMap id="BaseResultMap" type="com.pojo.Commodity" >
        <id column="id" property="id" jdbcType="INTEGER" />
        <result column="name" property="name" jdbcType="VARCHAR" />
        <result column="price" property="price" jdbcType="DOUBLE" />
        <result column="remainNumber" property="remainNumber" jdbcType="INTEGER" />
        <result column="soldOutNumber" property="soldOutNumber" jdbcType="INTEGER"/>
        <result column="description" property="description" jdbcType="VARCHAR"/>
        <result column="picture" property="picture" jdbcType="VARCHAR"/>
    </resultMap>
    <sql id="Base_Column_List" >
    id, name, price, remainNumber, soldOutNumber, description, picture
  </sql>
    <select id="selectAll" resultMap="BaseResultMap" >
        select * from commodity_1029
    </select>
    <select id="selectAllLimit" resultMap="BaseResultMap" >
        select * from commodity_1029 limit #{start},#{size}
    </select>
    <select id="selectByPrimaryKey" resultMap="BaseResultMap" parameterType="java.lang.Integer" >
        select
        <include refid="Base_Column_List" />
        from commodity_1029
        where id = #{id,jdbcType=INTEGER}
    </select>
    <select id="selectByName" resultMap="BaseResultMap" parameterType="java.lang.String" >
        select
        <include refid="Base_Column_List" />
        from commodity_1029
        where name like CONCAT("%",#{name ,jdbcType=VARCHAR},"%")
    </select>
    <delete id="deleteByPrimaryKey" parameterType="java.lang.Integer" >
    delete from commodity_1029
    where id = #{id,jdbcType=INTEGER}
  </delete>
    <insert id="insert" parameterType="com.pojo.Commodity" >
    insert into commodity_1029 (id, name, price,remainNumber,soldOutNumber,
      description,picture)
    values (#{id,jdbcType=INTEGER}, #{name,jdbcType=VARCHAR}, #{price,jdbcType=DOUBLE},
      #{remainNumber,jdbcType=INTEGER},#{soldOutNumber,jdbcType=INTEGER},#{description,jdbcType=VARCHAR},
      #{picture,jdbcType=VARCHAR})
  </insert>
</mapper>
```

#### TestService.java

_业务逻辑层接口_

```java
package com.service;

import com.pojo.Commodity;
import com.pojo.PageInfo;

import java.util.List;

public interface TestService {
    boolean insert(Commodity commodity);
    boolean delete(Commodity commodity);
    List<Commodity> queryOne(Commodity commodity);
    List<Commodity> queryAll();
    PageInfo<Commodity> queryByPage(int currentPage);
}
```

#### TestServiceImpl.java

```java
package com.service;

import com.pojo.Commodity;
import com.pojo.PageInfo;

import java.util.List;

public interface TestService {
    boolean insert(Commodity commodity);
    boolean delete(Commodity commodity);
    List<Commodity> queryOne(Commodity commodity);
    List<Commodity> queryAll();
    PageInfo<Commodity> queryByPage(int currentPage);
}
```

#### CommodityController.java

_控制器类_

```java
package com.controller;

import com.pojo.Commodity;
import com.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;

@Controller
@RequestMapping("/commodity")
public class CommodityController {
    @Autowired
    private TestService testService;

    @RequestMapping("/index")
    public String display(Model model, @RequestParam(defaultValue = "1") int currentPage,
                          HttpServletRequest request){
        String str=request.getParameter("pageNo");
        if (str!=null){
            currentPage= Integer.parseInt(str);
        }
        int pageCount=testService.queryByPage(currentPage).getTotalPage();
        int pagePrev=currentPage>1?currentPage-1:1;//上一页
        int pageNext=currentPage<pageCount?currentPage+1:pageCount;//下一页
        model.addAttribute("commoditys",testService.queryByPage(currentPage).getList());
        model.addAttribute("pageNo", currentPage);
        model.addAttribute("pageCount", pageCount);
        model.addAttribute("pageNow", currentPage);
        model.addAttribute("pagePrev", pagePrev);
        model.addAttribute("pageNext", pageNext);
        return "index";
    }

    @RequestMapping(value = "/query",method = RequestMethod.POST)
    public String queryOne(Commodity commodity,Model model){
        model.addAttribute("queryCommoditys",testService.queryOne(commodity));
        return "queryResult";
    }
    @RequestMapping(value = "/delete",method = RequestMethod.POST)
    public String delete(Commodity commodity,Model model){
        testService.delete(commodity);
//        model.addAttribute("deleteFlag",testService.delete(commodity));
        return "redirect:/commodity/index";
    }
    @RequestMapping(value = "/insert",method = RequestMethod.POST)
    public String insert(Commodity commodity, Model model,
                         @RequestParam("file") MultipartFile pictureFile, HttpServletRequest request) {

        //设置图片名称
        String picName = pictureFile.getOriginalFilename();
        commodity.setPicture(picName);

        File dir = new File("E:/Java Project/SSMProject/" +
                "Commodity_Message_Query/src/main/resources/picture",picName);
        if(!dir.exists()){
            dir.mkdirs();
        }
        //开始上传
        try {
            pictureFile.transferTo(dir);
        } catch (IOException exception) {
            exception.printStackTrace();
        }

        testService.insert(commodity);
//        model.addAttribute("insertFlag",testService.insert(commodity));
        //跳转到主页面(控制器之间的跳转)
        return "redirect:/commodity/index";
    }
}
```

#### index.jsp

_主页面_

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>商品主页</title>
</head>
<body>
<form action="/commodity/query" method="post">
    <input type="text" name="id" placeholder="输入需要查询的商品ID">
    <input type="submit" name="submits" value="查询商品">
</form>
<br>
<form action="/commodity/query" method="post">
    <input type="text" name="name" placeholder="输入需要查询的商品名称">
    <input type="submit" name="submits" value="查询商品">
</form>
<br>
<form action="/commodity/delete" method="post">
    <input type="text" name="id" placeholder="输入需要删除的商品ID">
    <input type="submit" name="submits" value="删除商品">
</form>
<br>
<form action="/commodity/insert" method="post" enctype="multipart/form-data">
    <input type="text" name="name" placeholder="商品名称">
    <input type="text" name="price" placeholder="商品价格">
    <input type="text" name="remainNumber" placeholder="商品数量">
    <input type="text" name="description" placeholder="商品描述">
    <input type="file" name="file" value="上传商品图片">
    <input type="submit" name="submits" value="增加商品">
</form>
<div>
    <h2>商品列表</h2>
    <table>
        <c:forEach items="${commoditys}" var="s">
            <tr>
                <td align="center">
                    <img src="picture/${s.picture}" alt="图片" width="200px" height="150px">
                </td>
                <td align="center">${s.id}</td>
                <td align="center">${s.name}</td>
                <td align="center">${s.price}元</td>
                <td align="center">${s.remainNumber}</td>
                <td align="center">${s.soldOutNumber}</td>
                <td align="center">${s.description}</td>
            </tr>
        </c:forEach>
    </table>
    <!--分页链接 -->
    <a href="/commodity/index?pageNo=1">首页</a>
    <a href="/commodity/index?pageNo=${pagePrev}">上一页</a>

    <c:forEach begin="1" end="${pageCount}" var="i">
        <a href="/commodity/index?pageNo=${i}">${i}</a> &nbsp;
    </c:forEach>
    <a href="/commodity/index?pageNo=${pageNext}">下一页</a>
    <a href="/commodity/index?pageNo=${pageCount}">尾页</a>
    <!--选择菜单-->
    <select onchange="window.location=this.value;">
        <c:forEach begin="1" end="${pageCount}" var="i">
            <c:choose>
                <c:when test="${pageNow == i }">
                    <option value="/commodity/index?pageNo=${i}"
                            selected="selected">${i}</option>
                </c:when>
                <c:otherwise>
                    <option value="/commodity/index?pageNo=${i}">${i}</option>
                </c:otherwise>
            </c:choose>
        </c:forEach>
    </select>
</div>
</body>
</html>
```

#### queryResult.jsp

_查询结果显示页面_

```jsp
<%--
  Created by IntelliJ IDEA.
  User: Lenovo
  Date: 2021/12/9
  Time: 20:42
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>查询结果</title>
</head>
<body>
<div>
    <h2>商品列表</h2>
    <table>
        <c:forEach items="${queryCommoditys}" var="s">
            <tr>
                <td align="center">
                    <img src="picture/${s.picture}" alt="图片" width="200px" height="150px">
                </td>
                <td align="center">${s.id}</td>
                <td align="center">${s.name}</td>
                <td align="center">${s.price}元</td>
                <td align="center">${s.remainNumber}</td>
                <td align="center">${s.soldOutNumber}</td>
                <td align="center">${s.description}</td>
            </tr>
        </c:forEach>
    </table>
</div>
</body>
</html>
```

#### 遇到的问题

```language
400错误 - Required MultipartFile parameter 'files' is not present
1.检查spring-mvc.xml配置中有没有添加文件上传解析，没有的话需要加上。
2.控制器方法参数加上@RequestParam("") 并加上名称，名称不能方法中的参数名相同，但是要与提交上的数据的key相同，即@RequestParam("file")与index.jsp中<input type="file" name="file" value="上传商品图片">对应
```

```language
400错误 - 由于被认为是客户端对错误（例如：畸形的请求语法、无效的请求信息帧或者虚拟的请求路由），服务器无法或不会处理当前请求。
参数需要对应，参考https://blog.csdn.net/qq_43639081/article/details/109511868
```



## 结束

