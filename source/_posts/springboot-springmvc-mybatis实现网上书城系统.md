---
title: SpringBoot+SpringMVC+Mybatis实现网上书城系统
date: 2022-01-16 11:34:08
tags: ["Mybatis","SpringBoot","Spring MVC"]
---

## 开始



### 功能说明

```language
1.用户注册、登录登出以及修改个人资料
2.书籍分类显示、热销书籍及新品展示
3.将书籍放入购物车或直接购买
4.权限拦截
5.推荐书籍
```



<!-- more -->

### 项目结构

![项目结构](project_structure.jpg)

![项目结构-Java部分](project_structure_java.jpg)

![项目结构-Thymeleaf部分](project_structure_thymeleaf.jpg)

### 数据表结构

#### user

```sql
CREATE TABLE  `user` (
  `id` varchar(64) NOT NULL  COMMENT '用户id',
  `username` varchar(100) DEFAULT NULL COMMENT '用户名',
  `password` varchar(100) DEFAULT NULL COMMENT '密码',
  `email` varchar(50) DEFAULT NULL COMMENT '用户邮箱',
  `phone` varchar(50) DEFAULT NULL COMMENT '用户电话',
  `address` varchar(255) DEFAULT NULL COMMENT '用户地址',
  `avatar` varchar(255) DEFAULT NULL COMMENT '用户头像地址',
  `vip` int(1) DEFAULT NULL COMMENT 'VIP信息',
  
  PRIMARY KEY (`id`)
);
```

#### book

```sql
CREATE TABLE  `book` (
  `id` varchar(64) NOT NULL  COMMENT '书籍id',
  `booknumber` varchar(255) DEFAULT NULL COMMENT '书籍编号',
  `bookname` varchar(255) DEFAULT NULL COMMENT '书籍名称',
  `author` varchar(255) DEFAULT NULL COMMENT '作者',
  `category` varchar(255) DEFAULT NULL COMMENT '书籍类别',
  `price` double DEFAULT NULL COMMENT '书籍价格',
  `number` int(50) DEFAULT NULL COMMENT '书籍数量',
  `soldoutnumber` int(50) DEFAULT NULL COMMENT '书籍已购数量',
  `description` varchar(255) DEFAULT NULL COMMENT '书籍描述',
  `time` varchar(255) DEFAULT NULL COMMENT '上架时间',
  `picture` varchar(255) DEFAULT NULL COMMENT '书籍图片地址',
  
  PRIMARY KEY (`id`)
);
```

#### trolley

```sql
CREATE TABLE  `trolley` (
    `id` varchar(64) NOT NULL  COMMENT '书籍id',
  `booknumber` varchar(255) DEFAULT NULL COMMENT '书籍编号',
  `bookname` varchar(255) DEFAULT NULL COMMENT '书籍名称',
  `author` varchar(255) DEFAULT NULL COMMENT '作者',
  `category` varchar(255) DEFAULT NULL COMMENT '书籍类别',
  `price` double DEFAULT NULL COMMENT '书籍价格',
  `number` int(50) DEFAULT NULL COMMENT '书籍数量',
  `soldoutnumber` int(50) DEFAULT NULL COMMENT '书籍已购数量',
  `description` varchar(255) DEFAULT NULL COMMENT '书籍描述',
  `time` varchar(255) DEFAULT NULL COMMENT '上架时间',
  `picture` varchar(255) DEFAULT NULL COMMENT '书籍图片地址',
  `putintime` varchar(255) DEFAULT NULL COMMENT '放入购物车时间',
  `purchasenumber` int(50) DEFAULT NULL COMMENT '购买数量',
  `note` varchar(255) DEFAULT NULL COMMENT '备注'
);
```

#### order

```sql
CREATE TABLE  `order` (
  `id` varchar(64) NOT NULL  COMMENT '订单id',
  `orderid` varchar(64) NOT NULL  COMMENT '订单编号',
  
  `bookid` varchar(64) NOT NULL  COMMENT '书籍id',
  `booknumber` varchar(255) DEFAULT NULL COMMENT '书籍编号',
  `bookname` varchar(255) DEFAULT NULL COMMENT '书籍名称',
  `author` varchar(255) DEFAULT NULL COMMENT '作者',
  `category` varchar(255) DEFAULT NULL COMMENT '书籍类别',
  `price` double DEFAULT NULL COMMENT '书籍价格',
  `number` int(50) DEFAULT NULL COMMENT '书籍数量',
  `soldoutnumber` int(50) DEFAULT NULL COMMENT '书籍已购数量',
  `description` varchar(255) DEFAULT NULL COMMENT '书籍描述',
  `time` varchar(255) DEFAULT NULL COMMENT '上架时间',
  `picture` varchar(255) DEFAULT NULL COMMENT '书籍图片地址',
  
  `userid` varchar(64) NOT NULL  COMMENT '用户id',
  `username` varchar(100) DEFAULT NULL COMMENT '用户名',
  `password` varchar(100) DEFAULT NULL COMMENT '密码',
  `email` varchar(50) DEFAULT NULL COMMENT '用户邮箱',
  `phone` varchar(50) DEFAULT NULL COMMENT '用户电话',
  `address` varchar(255) DEFAULT NULL COMMENT '用户地址',
  `avatar` varchar(255) DEFAULT NULL COMMENT '用户头像地址',
  `vip` int(1) DEFAULT NULL COMMENT 'VIP信息',
  
  `purchasetime` varchar(255) DEFAULT NULL COMMENT '购买时间',
  `purchasenumber` int(50) DEFAULT NULL COMMENT '购买数量',
  `note` varchar(255) DEFAULT NULL COMMENT '备注',
  
  PRIMARY KEY (`id`)
);
```



### 后端实现



#### [环境搭建](https://www.cnblogs.com/little-rain/p/11063967.html)

```language
1.左侧选择Spring Initializr时，右侧选择Default:https://start.spring.io/若是出现无法加载情况，可选择Custom:，然后输入https://start.aliyun.com/
2.勾选依赖时可只选择Web下的Spring Web Starter
```

#### pom.xml

```xml
        <!--mysql驱动依赖-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.25</version>
        </dependency>
        <!--mybatis整合springboot框架的起步依赖-->
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.2.0</version>
        </dependency>

        <!--thymeleaf 模板依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>
        <!-- 生产图片验证码依赖 -->
        <dependency>
            <groupId>com.github.penggle</groupId>
            <artifactId>kaptcha</artifactId>
            <version>2.3.2</version>
        </dependency>
        <!--   Shiro   -->
        <dependency>
            <groupId>org.apache.shiro</groupId>
            <artifactId>shiro-spring</artifactId>
            <version>1.4.0</version>
        </dependency>
        <!--支付宝支付依赖-->
        <dependency>
            <groupId>com.alipay.sdk</groupId>
            <artifactId>alipay-sdk-java</artifactId>
            <version>4.8.10.ALL</version>
        </dependency>
        <!--邮件发送-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-mail</artifactId>
        </dependency>
        <!--自动编译-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <optional>true</optional>
        </dependency>
```

```xml
            <!--mybatis自动生成代码的插件-->
            <plugin>
                <groupId>org.mybatis.generator</groupId>
                <artifactId>mybatis-generator-maven-plugin</artifactId>
                <version>1.3.6</version>
                <configuration>
                    <!--配置文件的位置（类路径下）-->
                    <configurationFile>GeneratorConfig.xml</configurationFile>
                    <verbose>true</verbose>
                    <overwrite>true</overwrite>
                </configuration>
            </plugin>
```

```xml
        <!--手动指定某些文件夹为resource文件夹，使其下的某些文件也被编译-->
        <resources>
            <!--所有sql映射文件在该目录下-->
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/*.*</include>
                </includes>
            </resource>
        </resources>
```

#### Mybatis逆向工程

```
1.pom.xml文件添加插件和指定resource文件夹（在上述步骤中已实现）
2.数据库配置信息
3.根目录下新建XML文件GeneratorConfig.xml
4.双击运行插件
```

```properties
#配置数据库连接信息
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/bookcity?serverTimezone=GMT%2B8
spring.datasource.username=bookcity
spring.datasource.password=lz2001031910167
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">
<generatorConfiguration>
    <!--指定连接数据库的jdbc驱动jar包所在位置-->
    <classPathEntry location="D:\Java\mysql-connector-java-8.0.23\mysql-connector-java-8.0.23.jar"/>
    <!--配置table信息体内容，指定采取mybatis3的版本-->
    <context id="MyGenerator" targetRuntime="MyBatis3" defaultModelType="flat">
        <!--去掉自动生成的注释和时间戳-->
        <commentGenerator>
            <property name="suppressAllComments" value="true" />
            <property name="suppressDate" value="true" />
        </commentGenerator>
        <!--配置数据库连接信息-->
        <jdbcConnection driverClass="com.mysql.jdbc.Driver"
                        connectionURL="jdbc:mysql://localhost:3306/bookcity?
serverTimezone=GMT%2B8"
                        userId="bookcity"
                        password="lz2001031910167">
            <!--高版本mysql驱动连接低版本mysql数据库需要此属性为true，建议每次都加-->
            <property name="nullCatalogMeansCurrent" value="true"/>
        </jdbcConnection>
        <!--JAVA JDBC数据类型转换-->
        <javaTypeResolver>
            <property name="forceBigDecimals" value="false" />
        </javaTypeResolver>
        <!--
        三大生成器
        -->
        <!--javaBean(实体类)生成器，targetPackage指定实体类的包名，targetProject指定输出在哪个文件夹
        下-->
        <javaModelGenerator targetPackage="com.ujs.bookcitydemo.entity"
                            targetProject="src\main\java">
            <!--直接在targetPackage包下生成sql映射文件，而不生成scheme名称的子包-->
            <property name="enableSubPackages" value="false" />
            <!--把char类型数据中未填写的位裁剪掉-->
            <property name="trimStrings" value="true" />
        </javaModelGenerator>
        <!--sql映射文件生成器-->
        <sqlMapGenerator targetPackage="com.ujs.bookcitydemo.mapper"
                         targetProject="src\main\java">
            <property name="enableSubPackages" value="false" />
        </sqlMapGenerator>
        <!--DAO接口生成器-->
        <javaClientGenerator type="XMLMAPPER" targetPackage="com.ujs.bookcitydemo.mapper"
                             targetProject="src\main\java">
            <property name="enableSubPackages" value="true" />
        </javaClientGenerator>
        <!--
        进行逆向映射的表，tableName为数据库中表名，domainObjectName为要生成的实体类的名称
        有几个表加几个table标签
        -->
<!--        <table tableName="user" domainObjectName="User"-->
<!--               enableCountByExample="false"-->
<!--               enableUpdateByExample="false"-->
<!--               enableDeleteByExample="false"-->
<!--               enableSelectByExample="false"-->
<!--               selectByExampleQueryId="false" />-->
        <table tableName="book" domainObjectName="Book"
               enableCountByExample="false"
               enableUpdateByExample="false"
               enableDeleteByExample="false"
               enableSelectByExample="false"
               selectByExampleQueryId="false" />
        <table tableName="trolley" domainObjectName="Trolley"
               enableCountByExample="false"
               enableUpdateByExample="false"
               enableDeleteByExample="false"
               enableSelectByExample="false"
               selectByExampleQueryId="false" />
        <table tableName="order" domainObjectName="Order"
               enableCountByExample="false"
               enableUpdateByExample="false"
               enableDeleteByExample="false"
               enableSelectByExample="false"
               selectByExampleQueryId="false" />
    </context>
</generatorConfiguration>
```

![运行Mybatis插件](mybatis-generator-plugin.jpg)

#### Controller

##### IndexController

```java
package com.ujs.bookcitydemo.controller;

import com.ujs.bookcitydemo.Util.Apriori;
import com.ujs.bookcitydemo.Util.ListUtil;
import com.ujs.bookcitydemo.entity.Book;
import com.ujs.bookcitydemo.entity.Order;
import com.ujs.bookcitydemo.entity.User;
import com.ujs.bookcitydemo.service.BookService;
import com.ujs.bookcitydemo.service.OrderService;
import com.ujs.bookcitydemo.service.UserService;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.*;

@Controller
public class IndexController {
    @Autowired
    private UserService userService;
    @Autowired
    private BookService bookService;
    @Autowired
    private OrderService orderService;
    @RequestMapping(value = "/404")
    public String enterError(){
        return "error/404";
    }
    @RequestMapping(value = "/")
    public String index(Model model, HttpServletRequest request){
        User user = (User) SecurityUtils.getSubject().getPrincipal(); // 获取当前登录用户
        model.addAttribute("user",user);
        HttpSession session = request.getSession(true);//创建session对象
        session.setAttribute("USER_INFO",user);//把用户数据保存到session对象中

        //获取前十个新品数据和热销数据并保存到session中
        List<Book> newBookListsLimitTen=bookService.getBookListsLimitTen("新品");
        List<Book> hotBookListsLimitTen=bookService.getBookListsLimitTen("热销");
        session.setAttribute("NEWBOOK_LIST",newBookListsLimitTen);
        session.setAttribute("HOTBOOK_LIST",hotBookListsLimitTen);

        //获取所有用户信息
        List<User> userLists=userService.getAllUser();
        //获取所有用户的所有订单信息
        ArrayList<List<Order>> orderLists=new ArrayList<List<Order>>();
        for (User u: userLists) {
            orderLists.add(orderService.getAllOrder(u.getId()+"_order"));
        }

        //根据Apriori算法获取推荐数据
        Apriori apriori=new Apriori();
        HashMap<ArrayList<String>, ArrayList<String>> recommendData=new HashMap<ArrayList<String>, ArrayList<String>>();
        recommendData=apriori.getResult(userLists,orderLists);

        if(user!=null){
            //获取用户所有订单信息
            List<Order> orderList= orderService.getAllOrder();
            //存放应该推荐的书籍id
            ArrayList<Object> recommendBookIdListObject = new ArrayList<>();
            List<String> recommendBookIdList=new LinkedList<String>();

            Set<Map.Entry<ArrayList<String>, ArrayList<String>>> entrySet = recommendData.entrySet();
            Iterator<Map.Entry<ArrayList<String>, ArrayList<String>>> it = entrySet.iterator();
            Map.Entry<ArrayList<String>, ArrayList<String>> entry;
            while (it.hasNext()) {
                entry = it.next();
                int count=0;
                //若用户购买的书籍数大于规则条件，则进行比较
                if(orderList.size()>entry.getKey().size()){
                    for (int i = 0; i < orderList.size(); i++) {
                        for (String key: entry.getKey()) {
                            if(key.equals(orderList.get(i).getBookid())){
                                count++;
                            }
                        }
                    }
                    //若满足规则的条件，则将条件得出的结论放入recommendBookIdListObject中
                    if(count==entry.getKey().size()){
                        recommendBookIdListObject.add(entry.getValue());
                        recommendBookIdList.addAll(entry.getValue());
                    }

                }
//                System.out.println(entry.getKey()+":"+entry.getValue());
            }

            //除去重复书籍id
            ListUtil listUtil=new ListUtil();
            recommendBookIdList=listUtil.removeDuplicate(recommendBookIdList);

            //由书籍ID获取数据
            List<Book> recommendBookList=new LinkedList<Book>();
            for (String s:recommendBookIdList) {
                recommendBookList.add(bookService.selectByPrimaryKey(s));
            }
            //如果推荐书籍数不足3
            switch (recommendBookIdList.size()){
                case 0: recommendBookList=hotBookListsLimitTen;
                break;
                case 1: recommendBookList.add(hotBookListsLimitTen.get(0));recommendBookList.add(hotBookListsLimitTen.get(1));
                break;
                case 2: recommendBookList.add(hotBookListsLimitTen.get(0));
                break;
                default:break;
            }
            //将推荐书籍放入session中
            session.setAttribute("RECOMMENDBOOK_LIST",recommendBookList);

        }

        return "index/index";
    }
}

```

##### UserController

```java
package com.ujs.bookcitydemo.controller;

import com.google.code.kaptcha.impl.DefaultKaptcha;
import com.ujs.bookcitydemo.MyResponse;
import com.ujs.bookcitydemo.entity.User;
import com.ujs.bookcitydemo.service.EmailService;
import com.ujs.bookcitydemo.service.UserService;
import jdk.nashorn.internal.parser.Token;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static com.ujs.bookcitydemo.Util.CodeGenerateUtil.generateVerCode;

@Controller
@RequestMapping(value = "/user")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private DefaultKaptcha captchaProducer;

    @Autowired
    private EmailService emailService;

    @RequestMapping("/showList")
    @ResponseBody
    public List<User> showList() throws Exception {
        List<User> users = userService.getAllUser();
        System.out.println(users);
        return users;
    }

    @RequestMapping(value = "/enterLogin")
    public String enterLogin(){
        return "user/login";
    }
    @RequestMapping(value = "/enterRegister")
    public String enterRegister(){
        return "user/register";
    }
    /*用户登录*/
    @PostMapping(value = "/login")
    public Object login(User user){
        String result;
        Subject subject = SecurityUtils.getSubject();
        UsernamePasswordToken token = new UsernamePasswordToken(user.getUsername(), user.getPassword());
        try {
            subject.login(token);
            result = "登陆成功";
            return "redirect:/";
        } catch (UnknownAccountException e) {
            result = "用户名不存在";
        } catch (IncorrectCredentialsException e) {
            result = "密码错误";
        }
        return "user/login";

    }
    /*注册表单提交*/
    @PostMapping(value = "/register")
    public Object register(User user,
                           HttpServletRequest httpServletRequest,
                           HttpServletResponse httpServletResponse) {
        MyResponse myResponse = new MyResponse();
        //验证码验证
        String captchaId = (String) httpServletRequest.getSession().getAttribute("verifyCode");
        String parameter = httpServletRequest.getParameter("verifyCode");
        //验证码错误返回注册页面
        if(!captchaId.equals(parameter)){
            myResponse.setStatus(0);
            myResponse.setMessage("验证码错误！");
            return "user/register";
        }
        HttpSession session=httpServletRequest.getSession(true);
        //发送邮件验证码
        String emailCode=generateVerCode();
        emailService.sendEmailCode(user.getEmail(),emailCode);
        session.setAttribute("EMAILCODE",emailCode);
        //将新用户的信息写入数据库
        int userTotalCount=userService.getAllUser().size();
        String userId= String.valueOf(++userTotalCount);
        user.setId(userId);
//        user.setAddress("");
//        user.setPhone("");
//        user.setAvatar("");
        user.setVip(0);
        session.setAttribute("USER_REGISTER_INFO",user);

        return "user/emailCode";

    }
    /*注册用户*/
    @RequestMapping(value = "/addUser")
    public String addUser(HttpServletRequest request){
        //获取用户输入的邮箱验证码
        String inputEmailCode=request.getParameter("inputEmailCode");

        MyResponse myResponse = new MyResponse();
        HttpSession session=request.getSession(true);
        User user=(User)session.getAttribute("USER_REGISTER_INFO");
        String emailCode= String.valueOf(session.getAttribute("EMAILCODE"));
        if (!emailCode.equals(inputEmailCode)){
            return "redirect:/user/enterRegister";
        }
        int createUserFlag = userService.addUser(user);
        //判断添加用户是否成功
        if (createUserFlag == 1 ) {
            myResponse.setStatus(1);
            myResponse.setMessage("添加成功！");
            return "user/login";
        } else {
            myResponse.setStatus(0);
            myResponse.setMessage("添加失败！");
            return "user/register";
        }
    }

    /*用户中心，可进行修改账号资料操作*/
    @RequestMapping(value = "/enterUserCenter")
    public String enterUserCenter(){
        return "user/userCenter";
    }
    /*进入修改账号资料页面*/
    @RequestMapping(value = "/enterAlterUser")
    public String enterAlterUser(){
        return "user/alter";
    }
    /*修改用户头像*/
    @RequestMapping(value = "/alterUserAvatar")
    public String alterUserAvatar(@RequestParam("file") MultipartFile file,HttpServletRequest request){
        String path = "E:\\Java Project\\book-city-demo\\src\\main\\resources\\static\\picture";
        String fileName = file.getOriginalFilename();//获取文件名称
        String suffixName=fileName.substring(fileName.lastIndexOf("."));//获取文件后缀
        fileName= UUID.randomUUID()+suffixName;//重新生成文件名
        File targetFile = new File(path);
        if (!targetFile.exists()) {
            // 判断文件夹是否存在
            targetFile.mkdirs();
        }
        File saveFile = new File(targetFile, fileName);
        try {
            //指定本地存入路径
            file.transferTo(saveFile);
            System.out.println("执行成功");
            String filePath = path + fileName;

            HttpSession session=request.getSession(true);
            User user = (User) session.getAttribute("USER_INFO");//获取当前用户数据
            user.setAvatar(fileName);
            //将新头像地址存入数据库和session
            int alterDBFlag=userService.alterUser(user);

            session.removeAttribute("USER_INFO");
            session.setAttribute("USER_INFO",user);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("执行失败");
        }

        return "redirect:/user/enterUserCenter";
    }
    /*修改账号资料*/
    @RequestMapping(value = "/alterUserData")
    public String alterUserData(User user,HttpServletRequest request){
        //将修改后的用户信息写入数据库
        User beforeUserData=(User) SecurityUtils.getSubject().getPrincipal();
        user.setId(beforeUserData.getId());
        user.setUsername(beforeUserData.getUsername());
        user.setVip(beforeUserData.getVip());
        int alterUserFlag= userService.alterUser(user);
        HttpSession session = request.getSession(true);
        session.removeAttribute("USER_INFO");
        session.setAttribute("USER_INFO",user);//把新的用户数据保存到session对象中
        //判断是否成功
        if(alterUserFlag==1){

        }else {

        }
        return "redirect:/user/enterUserCenter";
    }
    /*退出登录*/
    @RequestMapping(value = "/exitLogin")
    public String exitLogin(){
        SecurityUtils.getSubject().logout();
        return "redirect:/";
    }

    /*获取验证码*/
    @RequestMapping("/defaultKaptcha")
    public void defaultKaptcha(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse)
            throws Exception{
        byte[] captchaChallengeAsJpeg = null;
        ByteArrayOutputStream jpegOutputStream = new ByteArrayOutputStream();
        try {
            //生产验证码字符串并保存到session中
            String createText = captchaProducer.createText();
            httpServletRequest.getSession().setAttribute("verifyCode", createText);
            //使用生产的验证码字符串返回一个BufferedImage对象并转为byte写入到byte数组中
            BufferedImage challenge = captchaProducer.createImage(createText);
            ImageIO.write(challenge, "jpg", jpegOutputStream);
        } catch (IllegalArgumentException e) {
            httpServletResponse.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        //定义response输出类型为image/jpeg类型，使用response输出流输出图片的byte数组
        captchaChallengeAsJpeg = jpegOutputStream.toByteArray();
        httpServletResponse.setHeader("Cache-Control", "no-store");
        httpServletResponse.setHeader("Pragma", "no-cache");
        httpServletResponse.setDateHeader("Expires", 0);
        httpServletResponse.setContentType("image/jpeg");
        ServletOutputStream responseOutputStream =
                httpServletResponse.getOutputStream();
        responseOutputStream.write(captchaChallengeAsJpeg);
        responseOutputStream.flush();
        responseOutputStream.close();
    }


}
```

##### BookController

```java
package com.ujs.bookcitydemo.controller;

import com.ujs.bookcitydemo.Util.DisplayByPages;
import com.ujs.bookcitydemo.entity.Book;
import com.ujs.bookcitydemo.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.LinkedList;
import java.util.List;

@Controller
@RequestMapping(value = "/book")
public class BookController {
    @Autowired
    private BookService bookService;
    /*显示书籍列表*/
    @RequestMapping("/enterBookList")
    public String enterBookList(Model model, @RequestParam(defaultValue = "1") int currentPage,
                       HttpServletRequest request){
        int pageCount=1;
        List<Book> bookList=new LinkedList<Book>();
        String fullStr=request.getParameter("requestPage");
        String str=fullStr.substring(0,2);
        //接收用户点击的页码
        if(fullStr.contains("pageNo")){
            String pageNo=fullStr.substring(fullStr.length()-1);
            currentPage= Integer.parseInt(pageNo);
        }
        //判断请求的表格种类
        if(str.equals("新品")){
            pageCount= bookService.queryByPage(currentPage,"新品").getTotalPage();
            bookList= bookService.queryByPage(currentPage,"新品").getList();
        }else if(str.equals("热销")){
            pageCount= bookService.queryByPage(currentPage,"热销").getTotalPage();
            bookList= bookService.queryByPage(currentPage,"热销").getList();
        }else if(str!=null){
            pageCount= bookService.queryByPage(currentPage,str).getTotalPage();
            bookList= bookService.queryByPage(currentPage,str).getList();
        }

        DisplayByPages displayByPages=new DisplayByPages();
        model=displayByPages.pageModel(model,bookList,currentPage,pageCount,str);
        return "index/bookList";
    }
    /*显示书籍详情页*/
    @RequestMapping(value = "/enterBookMessage")
    public String enterBookMessage(Model model,HttpServletRequest request){
        //获取点击的书籍名称
        String str=request.getParameter("requestBook");
        Book book=new Book();
        book=bookService.selectByPrimaryKey(str);
        model.addAttribute("bookMessage",book);
        HttpSession session = request.getSession(true);
        session.setAttribute("BOOK_INFO",book);
        return "index/bookMessage";
    }
    /*搜索功能*/
    @RequestMapping(value = "/queryBookList")
    public String queryBookList(Model model,HttpServletRequest request,
                                @RequestParam(defaultValue = "1") int currentPage){
        String inputBookMessage=request.getParameter("inputBookMessage");
        List<Book> bookList=bookService.selectByBookName(inputBookMessage);
        //此处需要修改
        currentPage=1;
        int pageCount= 1;

        DisplayByPages displayByPages=new DisplayByPages();
        model=displayByPages.pageModel(model,bookList,currentPage,pageCount,inputBookMessage);
        return "index/bookList";
    }

}
```

##### TrolleyController

```java
package com.ujs.bookcitydemo.controller;

import com.ujs.bookcitydemo.Util.DisplayByPages;
import com.ujs.bookcitydemo.entity.Book;
import com.ujs.bookcitydemo.entity.Trolley;
import com.ujs.bookcitydemo.service.BookService;
import com.ujs.bookcitydemo.service.TrolleyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

@Controller
@RequestMapping(value = "trolley")
public class TrolleyController {
    @Autowired
    private TrolleyService trolleyService;
    /*显示购物车列表*/
    @RequestMapping("/enterTrolleyList")
    public String enterTrolleyList(Model model, @RequestParam(defaultValue = "1") int currentPage,
                                   HttpServletRequest request){
        int pageCount=1;
        List<Trolley> trolleyList=new LinkedList<Trolley>();
        String fullStr=request.getParameter("pageNo");
        if(fullStr!=null){
            currentPage=Integer.parseInt(fullStr);
        }
        pageCount=trolleyService.queryByPage(currentPage).getTotalPage();
        trolleyList=trolleyService.queryByPage(currentPage).getList();
        model=pageModel(model,trolleyList,currentPage,pageCount);
        return "purchase/trolley";
    }
    public Model pageModel(Model model, List<Trolley> list, int currentPage, int pageCount){
        int pagePrev=currentPage>1?currentPage-1:1;//上一页
        int pageNext=currentPage<pageCount?currentPage+1:pageCount;//下一页
        model.addAttribute("list", list);
        model.addAttribute("pageNo", currentPage);
        model.addAttribute("pageCount", pageCount);
        model.addAttribute("pagePrev", pagePrev);
        model.addAttribute("pageNext", pageNext);
        return model;
    }
    /*书籍商品添加到购物车*/
    @RequestMapping("/addToTrolley")
    public String addToTrolley(HttpServletRequest request){
        //获取当前时间
        Date date=new Date();
        SimpleDateFormat timeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        //获取用户输入的购买数量和备注信息
        String purchaseNumber=request.getParameter("purchaseNumber");
        String note=request.getParameter("note");
        if(note==null){
            note="无";
        }
        //从session中获取书籍信息
        HttpSession session = request.getSession(true);
        Book book= (Book) session.getAttribute("BOOK_INFO");
        //将信息注入到Trolley对象中
        Trolley trolley=new Trolley();
        trolley.setId(book.getId());
        trolley.setBookname(book.getBookname());
        trolley.setAuthor(book.getAuthor());
        trolley.setBooknumber(book.getBooknumber());
        trolley.setCategory(book.getCategory());
        trolley.setPrice(book.getPrice());
        trolley.setDescription(book.getDescription());
        trolley.setSoldoutnumber(book.getSoldoutnumber());
        trolley.setNumber(book.getNumber());
        trolley.setTime(book.getTime());
        trolley.setPicture(book.getPicture());
        trolley.setPutintime(timeFormat.format(date));
        trolley.setPurchasenumber(Integer.valueOf(purchaseNumber));
        trolley.setNote(note);
        int flag=trolleyService.addToTrolley(trolley);
        if(flag==1){

        }else {

        }
        return "redirect:/book/enterBookMessage?requestBook="+book.getId();
    }
}
```

##### OrderController

```java
package com.ujs.bookcitydemo.controller;

import com.ujs.bookcitydemo.entity.Book;
import com.ujs.bookcitydemo.entity.Order;
import com.ujs.bookcitydemo.entity.Trolley;
import com.ujs.bookcitydemo.entity.User;
import com.ujs.bookcitydemo.service.BookService;
import com.ujs.bookcitydemo.service.OrderService;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Controller
@RequestMapping(value = "/order")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    @Autowired
    private BookService bookService;
    /*显示订单列表*/
    @RequestMapping("/enterOrderList")
    public String enterOrderList(Model model, @RequestParam(defaultValue = "1") int currentPage,
                                   HttpServletRequest request){
        int pageCount=1;
        List<Order> orderList=new LinkedList<Order>();
        String fullStr=request.getParameter("pageNo");
        if(fullStr!=null){
            currentPage=Integer.parseInt(fullStr);
        }
        pageCount=orderService.queryByPage(currentPage).getTotalPage();
        orderList=orderService.queryByPage(currentPage).getList();
        model=pageModel(model,orderList,currentPage,pageCount);
        return "purchase/order";
    }
    public Model pageModel(Model model, List<Order> list, int currentPage, int pageCount){
        int pagePrev=currentPage>1?currentPage-1:1;//上一页
        int pageNext=currentPage<pageCount?currentPage+1:pageCount;//下一页
        model.addAttribute("list", list);
        model.addAttribute("pageNo", currentPage);
        model.addAttribute("pageCount", pageCount);
        model.addAttribute("pagePrev", pagePrev);
        model.addAttribute("pageNext", pageNext);
        return model;
    }
    /*生成订单信息*/
    @RequestMapping("/createOrder")
    public String createOrder(HttpServletRequest request){
        HttpSession session = request.getSession(true);
        //获取当前登录用户
        User user =(User) session.getAttribute("USER_INFO");
//        if(user.getAddress()==null||user.getPhone()==null){
//            return "redirect:/user/enterUserCenter";
//        }
        //获取当前时间
        Date date=new Date();
        SimpleDateFormat timeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        //获取购物车中数据（书籍ID、购买数量和备注）
        String trolleyData=request.getParameter("trolleyData");
        Book book=new Book();
        String purchaseNumber;
        String note;
        //如果用户是从购物车中购买，则trolleyData有值，否则是从商品详情页购买
        if(trolleyData!=null){
            String[] split = trolleyData.split(",");//以逗号分割
            String bookId=split[0];
            purchaseNumber=split[1];
            if(split.length==3){
                note=split[2];
            }else {
                note=null;
            }
            book=bookService.selectByPrimaryKey(bookId);
        }else {
            //从session中获取书籍信息
            book= (Book) session.getAttribute("BOOK_INFO");
            //获取用户输入
            purchaseNumber=request.getParameter("purchaseNumber");
            note=request.getParameter("note");
        }

        //获取当前所有订单数
        String orderTotalCount= String.valueOf(orderService.getAllOrder().size());

        Order order=new Order();
        order.setId(orderTotalCount);
        String regEx="[^0-9]";
        Pattern p = Pattern.compile(regEx);
        Matcher m = p.matcher(timeFormat.format(date));
        String orderId=m.replaceAll("").trim()+user.getId()+book.getId()+orderTotalCount;
        order.setOrderid(orderId);

        order.setBookid(book.getId());
        order.setBookname(book.getBookname());
        order.setBooknumber(book.getBooknumber());
        order.setAuthor(book.getAuthor());
        order.setCategory(book.getCategory());
        order.setDescription(book.getDescription());
        order.setTime(book.getTime());
        order.setPicture(book.getPicture());
        order.setPrice(book.getPrice());
        order.setNumber(book.getNumber());
        order.setSoldoutnumber(book.getSoldoutnumber());
        order.setUserid(user.getId());
        order.setUsername(user.getUsername());
        order.setPassword(user.getPassword());
        order.setEmail(user.getEmail());
        order.setPhone(user.getPhone());
        order.setAddress(user.getAddress());
        order.setAvatar(user.getAvatar());
        order.setPurchasetime(timeFormat.format(date));
        order.setVip(0);
        order.setPurchasenumber(Integer.valueOf(purchaseNumber));
        order.setNote(note);

        session.setAttribute("ORDER_MESSAGE",order);

        int flag= orderService.addToOrder(order);

        return "purchase/orderMessage";
    }
    /*订单信息提交到数据库*/
    @RequestMapping("/addToOrder")
    public String addToOrder(HttpServletRequest request){
        HttpSession session= request.getSession(true);
        Order order=(Order) session.getAttribute("ORDER_MESSAGE");
        int flag= orderService.addToOrder(order);
        return "index/index";
    }
}
```

##### AlipayController

```java
package com.ujs.bookcitydemo.controller;

import com.alipay.api.AlipayClient;
import com.alipay.api.DefaultAlipayClient;
import com.alipay.api.request.AlipayTradePagePayRequest;
import com.ujs.bookcitydemo.config.AlipayConfigInfo;
import com.ujs.bookcitydemo.entity.Book;
import com.ujs.bookcitydemo.entity.Order;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;

@Controller
@RequestMapping(value = "/alipay")
public class AlipayController {
    /**
     * @Description: 前往支付宝第三方网关进行支付
     */
    @RequestMapping(value = "goAlipay", produces = "text/html; charset=UTF-8")
    @ResponseBody
    public String goAlipay(HttpServletRequest request) throws Exception {
        HttpSession session= request.getSession(true);
        Order order=(Order) session.getAttribute("ORDER_MESSAGE");
        //获得初始化的AlipayClient
        AlipayClient alipayClient = new DefaultAlipayClient(AlipayConfigInfo.gatewayUrl, AlipayConfigInfo.app_id,
                AlipayConfigInfo.merchant_private_key, "json", AlipayConfigInfo.charset,
                AlipayConfigInfo.alipay_public_key, AlipayConfigInfo.sign_type);
        //设置请求参数
        AlipayTradePagePayRequest alipayRequest = new AlipayTradePagePayRequest();
        alipayRequest.setReturnUrl(AlipayConfigInfo.return_url);
        alipayRequest.setNotifyUrl(AlipayConfigInfo.notify_url);
        //商户订单号，商户网站订单系统中唯一订单号，必填
        String out_trade_no = order.getOrderid();
        //付款金额，必填
        String total_amount = String.valueOf(order.getPurchasenumber()*order.getPrice());
        //订单名称，必填
        String subject = order.getOrderid();
        //商品描述，可空
        String body = "用户订购商品个数：" + order.getPurchasenumber();
        // 该笔订单允许的最晚付款时间，逾期将关闭交易。
        String timeout_express = "1c";
        alipayRequest.setBizContent("{\"out_trade_no\":\""+ out_trade_no +"\","
                + "\"total_amount\":\""+ total_amount +"\","
                + "\"subject\":\""+ subject +"\","
                + "\"body\":\""+ body +"\","
                + "\"timeout_express\":\""+ timeout_express +"\","
                + "\"product_code\":\"FAST_INSTANT_TRADE_PAY\"}");
        //请求
        String result = alipayClient.pageExecute(alipayRequest).getBody();
        AlipayConfigInfo.logResult(result);// 记录支付日志
        return result;
    }
}
```

#### Service

##### UserService

```java
package com.ujs.bookcitydemo.service;

import com.ujs.bookcitydemo.entity.User;
import com.ujs.bookcitydemo.mapper.UserMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class UserService {
    @Resource
    private UserMapper userMapper;
    /*获取所有用户数据*/
    public List<User> getAllUser(){
        return userMapper.selectAllUser();
    }
    /*根据用户名获取用户数据*/
    public User getUserByName(String userName){
        User user=new User();
        user=userMapper.selectByUserName(userName);
        return user;
    }
    /*为新用户创建购物车数据表和订单数据表*/
    public int addUser(User user){
        String trolleyTableName= user.getId()+"_trolley";
        String orderTableName= user.getId()+"_order";
        int result;
        userMapper.createTrolleyTable(trolleyTableName);
        userMapper.createOrderTable(orderTableName);
        if (userMapper.insertSelective(user)==1){
            result=1;
        }else {
            result=0;
        }
        return result;
    }
    /*修改用户数据*/
    public int alterUser(User user){
        return userMapper.updateByPrimaryKeySelective(user);
    }
}
```

##### BookService

```java
package com.ujs.bookcitydemo.service;

import com.ujs.bookcitydemo.Util.BookSortBySoldOutNumber;
import com.ujs.bookcitydemo.Util.BookSortByTime;
import com.ujs.bookcitydemo.Util.DisplayByPages;
import com.ujs.bookcitydemo.entity.Book;
import com.ujs.bookcitydemo.entity.PageInfo;
import com.ujs.bookcitydemo.mapper.BookMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;

@Service
public class BookService {

    @Resource
    private BookMapper bookMapper;

    /*按页查询*/
    public PageInfo<Book> queryByPage(int currentPage,String str) {
        PageInfo pageInfo = new PageInfo();
        DisplayByPages displayByPages=new DisplayByPages();

        int size=DisplayByPages.getPageSize();
        int totalCount=1;
        int start = (currentPage - 1) * size;
        List<Book> bookList=new LinkedList<Book>();
        //根据查询请求进行将所需数据放入bookList中
        if(str.equals("全部")){
            bookList= bookMapper.selectAllLimit(start, size);
            totalCount=bookMapper.selectAll().size();
        }else if(str.equals("新品")){
            List<Book> bookLists=sortByTime();
            bookList=getCurrentPageList(start,bookLists);
            totalCount=bookMapper.selectAll().size();
        } else if(str.equals("热销")){
            List<Book> bookLists= sortBySoldOutNumber();
            bookList= getCurrentPageList(start,bookLists);
            totalCount=bookMapper.selectAll().size();
        }else if(str!=null){
            List<Book> bookLists= bookMapper.selectByCategory(str);
            bookList= getCurrentPageList(start,bookLists);
            totalCount=bookList.size();
            if(totalCount==0){
                totalCount=1;
            }
        }

        pageInfo= displayByPages.pageInfo(currentPage,bookList,totalCount);

        return pageInfo;
    }

    /*将所有书籍按上架时间排序*/
    public List<Book> sortByTime(){
        List<Book> bookLists=bookMapper.selectAll();
        Comparator comparator=new BookSortByTime();
        Collections.sort(bookLists,comparator);
        return bookLists;
    }
    /*将所有书籍数据按售出数量（热度）排序*/
    public List<Book> sortBySoldOutNumber(){
        List<Book> bookLists=bookMapper.selectAll();
        Comparator comparator=new BookSortBySoldOutNumber();
        Collections.sort(bookLists,comparator);
        return bookLists;
    }
    /*获取当前页的数据*/
    public List<Book> getCurrentPageList(int start, List<Book> bookLists){
        List<Book> bookList=new LinkedList<Book>();
        for (int i = 0; i < Math.min(DisplayByPages.getPageSize(),bookLists.size()-start); i++) {
            bookList.add(bookLists.get(start+i));
        }
        return bookList;
    }
    /*按书籍ID查询*/
    public Book selectByPrimaryKey(String id){
        Book book=bookMapper.selectByPrimaryKey(id);
        return book;
    }
    /*按书籍名称查询*/
    public List<Book> selectByBookName(String bookName){
        return bookMapper.selectByBookName(bookName);
    }
    /*获取按时间或热度排序前十个Book对象数据（主页使用）*/
    public List<Book> getBookListsLimitTen(String str){
        List<Book> bookLists=new LinkedList<Book>();
        if(str.equals("新品")){
            bookLists=sortByTime();
        }else if(str.equals("热销")){
            bookLists=sortBySoldOutNumber();
        }else {
            bookLists=bookMapper.selectAll();
        }
        List<Book> bookList=new LinkedList<Book>();
        for (int i = 0; i < 10; i++) {
            bookList.add(bookLists.get(i));
        }
        return bookList;
    }
}
```

##### TrolleyService

```java
package com.ujs.bookcitydemo.service;

import com.ujs.bookcitydemo.Util.DisplayByPages;
import com.ujs.bookcitydemo.entity.Book;
import com.ujs.bookcitydemo.entity.PageInfo;
import com.ujs.bookcitydemo.entity.Trolley;
import com.ujs.bookcitydemo.entity.User;
import com.ujs.bookcitydemo.mapper.TrolleyMapper;
import org.apache.shiro.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.LinkedList;
import java.util.List;

@Service
public class TrolleyService {
    @Resource
    private TrolleyMapper trolleyMapper;

    /*按页查询*/
    public PageInfo<Trolley> queryByPage(int currentPage) {
        User user = (User) SecurityUtils.getSubject().getPrincipal(); // 获取当前登录用户
        String tableName= user.getId()+"_trolley";
        PageInfo pageInfo = new PageInfo();
        DisplayByPages displayByPages=new DisplayByPages();

        int size=DisplayByPages.getPageSize();
        int totalCount=1;
        int start = (currentPage - 1) * size;
        List<Trolley> trolleyList=new LinkedList<Trolley>();
        trolleyList=trolleyMapper.selectAllLimit(tableName,start,size);
        totalCount=trolleyMapper.selectAll(tableName).size();
        if(totalCount==0){
            totalCount=1;
        }

        pageInfo= displayByPages.pageInfo(currentPage,trolleyList,totalCount);

        return pageInfo;
    }
    /*添加书籍商品到购物车*/
    public int addToTrolley(Trolley trolley){
        User user = (User) SecurityUtils.getSubject().getPrincipal(); // 获取当前登录用户
        String tableName= user.getId()+"_trolley";
        return trolleyMapper.insertTrolley(tableName,trolley);
    }
}
```

##### OrderService

```java
package com.ujs.bookcitydemo.service;

import com.ujs.bookcitydemo.Util.DisplayByPages;
import com.ujs.bookcitydemo.entity.Order;
import com.ujs.bookcitydemo.entity.PageInfo;
import com.ujs.bookcitydemo.entity.User;
import com.ujs.bookcitydemo.mapper.OrderMapper;
import org.apache.shiro.SecurityUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.LinkedList;
import java.util.List;

@Service
public class OrderService {
    @Resource
    private OrderMapper orderMapper;
    /*按页查询*/
    public PageInfo<Order> queryByPage(int currentPage) {
        User user = (User) SecurityUtils.getSubject().getPrincipal(); // 获取当前登录用户
        String tableName= user.getId()+"_order";
        PageInfo pageInfo = new PageInfo();
        DisplayByPages displayByPages=new DisplayByPages();

        int size=DisplayByPages.getPageSize();
        int totalCount=1;
        int start = (currentPage - 1) * size;
        List<Order> orderList=new LinkedList<Order>();
        orderList=orderMapper.selectAllLimit(tableName,start,size);
        totalCount=orderMapper.selectAll(tableName).size();
        if(totalCount==0){
            totalCount=1;
        }

        pageInfo= displayByPages.pageInfo(currentPage,orderList,totalCount);

        return pageInfo;
    }
    /*添加数据到订单表*/
    public int addToOrder(Order order){
        User user = (User) SecurityUtils.getSubject().getPrincipal(); // 获取当前登录用户
        String tableName= user.getId()+"_order";
        return orderMapper.insertOrder(tableName,order);
    }
    /*获取所有订单*/
    public List<Order> getAllOrder(){
        User user = (User) SecurityUtils.getSubject().getPrincipal(); // 获取当前登录用户
        String tableName= user.getId()+"_order";
        return orderMapper.selectAll(tableName);
    }
    /*获取指定用户的所有订单*/
    public List<Order> getAllOrder(String tableName){
        return orderMapper.selectAll(tableName);
    }
}
```

##### EmailService

```java
package com.ujs.bookcitydemo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    JavaMailSenderImpl mailSender;

    /**
     * 从配置文件中获取发件人
     */
    @Value("${spring.mail.username}")
    private String sender;

    /**
     * 邮件发送
     * @param receiver 收件人
     * @param verCode 验证码
     * @throws MailSendException 邮件发送错误
     */
    @Async
    public void sendEmailCode(String receiver, String verCode) throws MailSendException {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setSubject("黑大帅商城");	//设置邮件标题
        message.setText("尊敬的用户,您好:\n"
                + "\n本次请求的邮件验证码为:" + verCode + ",本验证码5分钟内有效，请及时输入。（请勿泄露此验证码）\n"
                + "\n如非本人操作，请忽略该邮件。");	//设置邮件正文
        message.setTo(receiver);	//设置收件人
        message.setFrom(sender);	//设置发件人
        mailSender.send(message);	//发送邮件
    }
}
```

#### Entity

```language
这一部分Mybatis插件自动生成
```

#### Mapper

##### UserMapper

```java
package com.ujs.bookcitydemo.mapper;

import com.ujs.bookcitydemo.entity.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface UserMapper {
    int deleteByPrimaryKey(String id);

    int insert(User record);

    int insertSelective(User record);

    List<User> selectAllUser();

    User selectByPrimaryKey(String id);

    User selectByUserName(String userName);

    int updateByPrimaryKeySelective(User record);

    int updateByPrimaryKey(User record);

    //创建相应购物车表
    int createTrolleyTable(@Param("tableName") String str);
    //创建相应订单表
    int createOrderTable(@Param("tableName") String str);
}
```

##### UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.ujs.bookcitydemo.mapper.UserMapper">
  <resultMap id="BaseResultMap" type="com.ujs.bookcitydemo.entity.User">
    <id column="id" jdbcType="VARCHAR" property="id" />
    <result column="username" jdbcType="VARCHAR" property="username" />
    <result column="password" jdbcType="VARCHAR" property="password" />
    <result column="email" jdbcType="VARCHAR" property="email" />
    <result column="phone" jdbcType="VARCHAR" property="phone" />
    <result column="address" jdbcType="VARCHAR" property="address" />
    <result column="avatar" jdbcType="VARCHAR" property="avatar" />
    <result column="vip" jdbcType="INTEGER" property="vip" />
  </resultMap>
  <sql id="Base_Column_List">
    id, username, password, email, phone, address, avatar, vip
  </sql>
  <select id="selectAllUser" parameterType="java.lang.String" resultMap="BaseResultMap">
    select
    <include refid="Base_Column_List" />
    from user
  </select>
  <select id="selectByPrimaryKey" parameterType="java.lang.String" resultMap="BaseResultMap">
    select 
    <include refid="Base_Column_List" />
    from user
    where id = #{id,jdbcType=VARCHAR}
  </select>
  <select id="selectByUserName" parameterType="java.lang.String" resultMap="BaseResultMap">
    select
    <include refid="Base_Column_List" />
    from user
    where username = #{username,jdbcType=VARCHAR}
  </select>
  <delete id="deleteByPrimaryKey" parameterType="java.lang.String">
    delete from user
    where id = #{id,jdbcType=VARCHAR}
  </delete>
  <insert id="insert" parameterType="com.ujs.bookcitydemo.entity.User">
    insert into user (id, username, password, 
      email, phone, address, 
      avatar, vip)
    values (#{id,jdbcType=VARCHAR}, #{username,jdbcType=VARCHAR}, #{password,jdbcType=VARCHAR}, 
      #{email,jdbcType=VARCHAR}, #{phone,jdbcType=VARCHAR}, #{address,jdbcType=VARCHAR}, 
      #{avatar,jdbcType=VARCHAR}, #{vip,jdbcType=INTEGER})
  </insert>
  <insert id="insertSelective" parameterType="com.ujs.bookcitydemo.entity.User">
    insert into user
    <trim prefix="(" suffix=")" suffixOverrides=",">
      <if test="id != null">
        id,
      </if>
      <if test="username != null">
        username,
      </if>
      <if test="password != null">
        password,
      </if>
      <if test="email != null">
        email,
      </if>
      <if test="phone != null">
        phone,
      </if>
      <if test="address != null">
        address,
      </if>
      <if test="avatar != null">
        avatar,
      </if>
      <if test="vip != null">
        vip,
      </if>
    </trim>
    <trim prefix="values (" suffix=")" suffixOverrides=",">
      <if test="id != null">
        #{id,jdbcType=VARCHAR},
      </if>
      <if test="username != null">
        #{username,jdbcType=VARCHAR},
      </if>
      <if test="password != null">
        #{password,jdbcType=VARCHAR},
      </if>
      <if test="email != null">
        #{email,jdbcType=VARCHAR},
      </if>
      <if test="phone != null">
        #{phone,jdbcType=VARCHAR},
      </if>
      <if test="address != null">
        #{address,jdbcType=VARCHAR},
      </if>
      <if test="avatar != null">
        #{avatar,jdbcType=VARCHAR},
      </if>
      <if test="vip != null">
        #{vip,jdbcType=INTEGER},
      </if>
    </trim>
  </insert>
  <update id="updateByPrimaryKeySelective" parameterType="com.ujs.bookcitydemo.entity.User">
    update user
    <set>
      <if test="username != null">
        username = #{username,jdbcType=VARCHAR},
      </if>
      <if test="password != null">
        password = #{password,jdbcType=VARCHAR},
      </if>
      <if test="email != null">
        email = #{email,jdbcType=VARCHAR},
      </if>
      <if test="phone != null">
        phone = #{phone,jdbcType=VARCHAR},
      </if>
      <if test="address != null">
        address = #{address,jdbcType=VARCHAR},
      </if>
      <if test="avatar != null">
        avatar = #{avatar,jdbcType=VARCHAR},
      </if>
      <if test="vip != null">
        vip = #{vip,jdbcType=INTEGER},
      </if>
    </set>
    where id = #{id,jdbcType=VARCHAR}
  </update>
  <update id="updateByPrimaryKey" parameterType="com.ujs.bookcitydemo.entity.User">
    update user
    set username = #{username,jdbcType=VARCHAR},
      password = #{password,jdbcType=VARCHAR},
      email = #{email,jdbcType=VARCHAR},
      phone = #{phone,jdbcType=VARCHAR},
      address = #{address,jdbcType=VARCHAR},
      avatar = #{avatar,jdbcType=VARCHAR},
      vip = #{vip,jdbcType=INTEGER}
    where id = #{id,jdbcType=VARCHAR}
  </update>

  <update id="createTrolleyTable" parameterType="java.lang.String" >
    CREATE TABLE ${tableName} (
      `id` varchar(64) NOT NULL  COMMENT '书籍id',
      `booknumber` varchar(255) DEFAULT NULL COMMENT '书籍编号',
      `bookname` varchar(255) DEFAULT NULL COMMENT '书籍名称',
      `author` varchar(255) DEFAULT NULL COMMENT '作者',
      `category` varchar(255) DEFAULT NULL COMMENT '书籍类别',
      `price` double DEFAULT NULL COMMENT '书籍价格',
      `number` int(50) DEFAULT NULL COMMENT '书籍数量',
      `soldoutnumber` int(50) DEFAULT NULL COMMENT '书籍已购数量',
      `description` varchar(255) DEFAULT NULL COMMENT '书籍描述',
      `time` varchar(255) DEFAULT NULL COMMENT '上架时间',
      `picture` varchar(255) DEFAULT NULL COMMENT '书籍图片地址',
      `putintime` varchar(255) DEFAULT NULL COMMENT '放入购物车时间',
      `purchasenumber` int(50) DEFAULT NULL COMMENT '购买数量',
      `note` varchar(255) DEFAULT NULL COMMENT '备注'
    );
  </update>
  <update id="createOrderTable" parameterType="java.lang.String">
    CREATE TABLE ${tableName} (
    `id` varchar(64) NOT NULL  COMMENT '订单id',
    `orderid` varchar(64) NOT NULL  COMMENT '订单编号',

    `bookid` varchar(64) NOT NULL  COMMENT '书籍id',
    `booknumber` varchar(255) DEFAULT NULL COMMENT '书籍编号',
    `bookname` varchar(255) DEFAULT NULL COMMENT '书籍名称',
    `author` varchar(255) DEFAULT NULL COMMENT '作者',
    `category` varchar(255) DEFAULT NULL COMMENT '书籍类别',
    `price` double DEFAULT NULL COMMENT '书籍价格',
    `number` int(50) DEFAULT NULL COMMENT '书籍数量',
    `soldoutnumber` int(50) DEFAULT NULL COMMENT '书籍已购数量',
    `description` varchar(255) DEFAULT NULL COMMENT '书籍描述',
    `time` varchar(255) DEFAULT NULL COMMENT '上架时间',
    `picture` varchar(255) DEFAULT NULL COMMENT '书籍图片地址',

    `userid` varchar(64) NOT NULL  COMMENT '用户id',
    `username` varchar(100) DEFAULT NULL COMMENT '用户名',
    `password` varchar(100) DEFAULT NULL COMMENT '密码',
    `email` varchar(50) DEFAULT NULL COMMENT '用户邮箱',
    `phone` varchar(50) DEFAULT NULL COMMENT '用户电话',
    `address` varchar(255) DEFAULT NULL COMMENT '用户地址',
    `avatar` varchar(255) DEFAULT NULL COMMENT '用户头像地址',
    `vip` int(1) DEFAULT NULL COMMENT 'VIP信息',

    `purchasetime` varchar(255) DEFAULT NULL COMMENT '购买时间',
    `purchasenumber` int(50) DEFAULT NULL COMMENT '购买数量',
    `note` varchar(255) DEFAULT NULL COMMENT '备注',
    PRIMARY KEY (`id`)
    );
  </update>

</mapper>
```

##### BookMapper

```java
package com.ujs.bookcitydemo.mapper;

import com.ujs.bookcitydemo.entity.Book;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface BookMapper {
    int deleteByPrimaryKey(String id);

    int insert(Book record);

    int insertSelective(Book record);

    Book selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(Book record);

    int updateByPrimaryKey(Book record);

    //根据书名查询
    List<Book> selectByBookName(String bookName);
    //根据类别查询
    List<Book> selectByCategory(String category);
    //查询所有数据
    List<Book> selectAll();
    //查询指定页面数据
    List<Book> selectAllLimit(@Param("start") int start, @Param("size")int size);
}
```

##### BookMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.ujs.bookcitydemo.mapper.BookMapper">
  <resultMap id="BaseResultMap" type="com.ujs.bookcitydemo.entity.Book">
    <id column="id" jdbcType="VARCHAR" property="id" />
    <result column="booknumber" jdbcType="VARCHAR" property="booknumber" />
    <result column="bookname" jdbcType="VARCHAR" property="bookname" />
    <result column="author" jdbcType="VARCHAR" property="author" />
    <result column="category" jdbcType="VARCHAR" property="category" />
    <result column="price" jdbcType="DOUBLE" property="price" />
    <result column="number" jdbcType="INTEGER" property="number" />
    <result column="soldoutnumber" jdbcType="INTEGER" property="soldoutnumber" />
    <result column="description" jdbcType="VARCHAR" property="description" />
    <result column="time" jdbcType="VARCHAR" property="time" />
    <result column="picture" jdbcType="VARCHAR" property="picture" />
  </resultMap>
  <sql id="Base_Column_List">
    id, booknumber, bookname, author, category, price, number, soldoutnumber, description, 
    time, picture
  </sql>
  <select id="selectByPrimaryKey" parameterType="java.lang.String" resultMap="BaseResultMap">
    select 
    <include refid="Base_Column_List" />
    from book
    where id = #{id,jdbcType=VARCHAR}
  </select>
  <select id="selectByBookName" parameterType="java.lang.String" resultMap="BaseResultMap">
    select
    <include refid="Base_Column_List" />
    from book
    where bookname = #{bookname,jdbcType=VARCHAR}
  </select>
  <select id="selectByCategory" parameterType="java.lang.String" resultMap="BaseResultMap">
    select
    <include refid="Base_Column_List" />
    from book
    where category = #{category,jdbcType=VARCHAR}
  </select>
  <select id="selectAll" resultMap="BaseResultMap">
    select
    <include refid="Base_Column_List" />
    from book
  </select>
  <select id="selectAllLimit" resultMap="BaseResultMap">
    select
    <include refid="Base_Column_List" />
    from book
    limit #{start},#{size}
  </select>
  <delete id="deleteByPrimaryKey" parameterType="java.lang.String">
    delete from book
    where id = #{id,jdbcType=VARCHAR}
  </delete>
  <insert id="insert" parameterType="com.ujs.bookcitydemo.entity.Book">
    insert into book (id, booknumber, bookname, 
      author, category, price, 
      number, soldoutnumber, description, 
      time, picture)
    values (#{id,jdbcType=VARCHAR}, #{booknumber,jdbcType=VARCHAR}, #{bookname,jdbcType=VARCHAR}, 
      #{author,jdbcType=VARCHAR}, #{category,jdbcType=VARCHAR}, #{price,jdbcType=DOUBLE}, 
      #{number,jdbcType=INTEGER}, #{soldoutnumber,jdbcType=INTEGER}, #{description,jdbcType=VARCHAR}, 
      #{time,jdbcType=VARCHAR}, #{picture,jdbcType=VARCHAR})
  </insert>
  <insert id="insertSelective" parameterType="com.ujs.bookcitydemo.entity.Book">
    insert into book
    <trim prefix="(" suffix=")" suffixOverrides=",">
      <if test="id != null">
        id,
      </if>
      <if test="booknumber != null">
        booknumber,
      </if>
      <if test="bookname != null">
        bookname,
      </if>
      <if test="author != null">
        author,
      </if>
      <if test="category != null">
        category,
      </if>
      <if test="price != null">
        price,
      </if>
      <if test="number != null">
        number,
      </if>
      <if test="soldoutnumber != null">
        soldoutnumber,
      </if>
      <if test="description != null">
        description,
      </if>
      <if test="time != null">
        time,
      </if>
      <if test="picture != null">
        picture,
      </if>
    </trim>
    <trim prefix="values (" suffix=")" suffixOverrides=",">
      <if test="id != null">
        #{id,jdbcType=VARCHAR},
      </if>
      <if test="booknumber != null">
        #{booknumber,jdbcType=VARCHAR},
      </if>
      <if test="bookname != null">
        #{bookname,jdbcType=VARCHAR},
      </if>
      <if test="author != null">
        #{author,jdbcType=VARCHAR},
      </if>
      <if test="category != null">
        #{category,jdbcType=VARCHAR},
      </if>
      <if test="price != null">
        #{price,jdbcType=DOUBLE},
      </if>
      <if test="number != null">
        #{number,jdbcType=INTEGER},
      </if>
      <if test="soldoutnumber != null">
        #{soldoutnumber,jdbcType=INTEGER},
      </if>
      <if test="description != null">
        #{description,jdbcType=VARCHAR},
      </if>
      <if test="time != null">
        #{time,jdbcType=VARCHAR},
      </if>
      <if test="picture != null">
        #{picture,jdbcType=VARCHAR},
      </if>
    </trim>
  </insert>
  <update id="updateByPrimaryKeySelective" parameterType="com.ujs.bookcitydemo.entity.Book">
    update book
    <set>
      <if test="booknumber != null">
        booknumber = #{booknumber,jdbcType=VARCHAR},
      </if>
      <if test="bookname != null">
        bookname = #{bookname,jdbcType=VARCHAR},
      </if>
      <if test="author != null">
        author = #{author,jdbcType=VARCHAR},
      </if>
      <if test="category != null">
        category = #{category,jdbcType=VARCHAR},
      </if>
      <if test="price != null">
        price = #{price,jdbcType=DOUBLE},
      </if>
      <if test="number != null">
        number = #{number,jdbcType=INTEGER},
      </if>
      <if test="soldoutnumber != null">
        soldoutnumber = #{soldoutnumber,jdbcType=INTEGER},
      </if>
      <if test="description != null">
        description = #{description,jdbcType=VARCHAR},
      </if>
      <if test="time != null">
        time = #{time,jdbcType=VARCHAR},
      </if>
      <if test="picture != null">
        picture = #{picture,jdbcType=VARCHAR},
      </if>
    </set>
    where id = #{id,jdbcType=VARCHAR}
  </update>
  <update id="updateByPrimaryKey" parameterType="com.ujs.bookcitydemo.entity.Book">
    update book
    set booknumber = #{booknumber,jdbcType=VARCHAR},
      bookname = #{bookname,jdbcType=VARCHAR},
      author = #{author,jdbcType=VARCHAR},
      category = #{category,jdbcType=VARCHAR},
      price = #{price,jdbcType=DOUBLE},
      number = #{number,jdbcType=INTEGER},
      soldoutnumber = #{soldoutnumber,jdbcType=INTEGER},
      description = #{description,jdbcType=VARCHAR},
      time = #{time,jdbcType=VARCHAR},
      picture = #{picture,jdbcType=VARCHAR}
    where id = #{id,jdbcType=VARCHAR}
  </update>
</mapper>
```

##### TrolleyMapper

```java
package com.ujs.bookcitydemo.mapper;

import com.ujs.bookcitydemo.entity.Trolley;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface TrolleyMapper {
    int insert(Trolley record);

    int insertSelective(Trolley record);

    //查询所有数据
    List<Trolley> selectAll(@Param("tableName") String str);
    //查询指定页面数据
    List<Trolley> selectAllLimit(@Param("tableName") String str,@Param("start") int start, @Param("size")int size);
    //插入数据到特定表
    int insertTrolley(@Param("tableName") String str,@Param("record")Trolley record);
}
```

##### TrolleyMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.ujs.bookcitydemo.mapper.TrolleyMapper">
  <resultMap id="BaseResultMap" type="com.ujs.bookcitydemo.entity.Trolley">
    <result column="id" jdbcType="VARCHAR" property="id" />
    <result column="booknumber" jdbcType="VARCHAR" property="booknumber" />
    <result column="bookname" jdbcType="VARCHAR" property="bookname" />
    <result column="author" jdbcType="VARCHAR" property="author" />
    <result column="category" jdbcType="VARCHAR" property="category" />
    <result column="price" jdbcType="DOUBLE" property="price" />
    <result column="number" jdbcType="INTEGER" property="number" />
    <result column="soldoutnumber" jdbcType="INTEGER" property="soldoutnumber" />
    <result column="description" jdbcType="VARCHAR" property="description" />
    <result column="time" jdbcType="VARCHAR" property="time" />
    <result column="picture" jdbcType="VARCHAR" property="picture" />
    <result column="putintime" jdbcType="VARCHAR" property="putintime" />
    <result column="purchasenumber" jdbcType="INTEGER" property="purchasenumber" />
    <result column="note" jdbcType="VARCHAR" property="note" />
  </resultMap>
  <select id="selectAll" parameterType="java.lang.String" resultMap="BaseResultMap">
    select * from ${tableName}
  </select>
  <select id="selectAllLimit" resultMap="BaseResultMap">
    select
    *
    from ${tableName}
    limit #{start},#{size}
  </select>
  <insert id="insertTrolley">
    insert into ${tableName} (id, booknumber, bookname,
      author, category, price,
      number, soldoutnumber, description,
      time, picture, putintime,
      purchasenumber, note)
    values (#{record.id}, #{record.booknumber}, #{record.bookname},
      #{record.author}, #{record.category}, #{record.price},
      #{record.number}, #{record.soldoutnumber}, #{record.description},
      #{record.time}, #{record.picture}, #{record.putintime},
      #{record.purchasenumber}, #{record.note})
  </insert>
  <insert id="insert" parameterType="com.ujs.bookcitydemo.entity.Trolley">
    insert into trolley (id, booknumber, bookname,
      author, category, price, 
      number, soldoutnumber, description, 
      time, picture, putintime, 
      purchasenumber, note)
    values (#{id,jdbcType=VARCHAR}, #{booknumber,jdbcType=VARCHAR}, #{bookname,jdbcType=VARCHAR}, 
      #{author,jdbcType=VARCHAR}, #{category,jdbcType=VARCHAR}, #{price,jdbcType=DOUBLE}, 
      #{number,jdbcType=INTEGER}, #{soldoutnumber,jdbcType=INTEGER}, #{description,jdbcType=VARCHAR}, 
      #{time,jdbcType=VARCHAR}, #{picture,jdbcType=VARCHAR}, #{putintime,jdbcType=VARCHAR}, 
      #{purchasenumber,jdbcType=INTEGER}, #{note,jdbcType=VARCHAR})
  </insert>
  <insert id="insertSelective" parameterType="com.ujs.bookcitydemo.entity.Trolley">
    insert into trolley
    <trim prefix="(" suffix=")" suffixOverrides=",">
      <if test="id != null">
        id,
      </if>
      <if test="booknumber != null">
        booknumber,
      </if>
      <if test="bookname != null">
        bookname,
      </if>
      <if test="author != null">
        author,
      </if>
      <if test="category != null">
        category,
      </if>
      <if test="price != null">
        price,
      </if>
      <if test="number != null">
        number,
      </if>
      <if test="soldoutnumber != null">
        soldoutnumber,
      </if>
      <if test="description != null">
        description,
      </if>
      <if test="time != null">
        time,
      </if>
      <if test="picture != null">
        picture,
      </if>
      <if test="putintime != null">
        putintime,
      </if>
      <if test="purchasenumber != null">
        purchasenumber,
      </if>
      <if test="note != null">
        note,
      </if>
    </trim>
    <trim prefix="values (" suffix=")" suffixOverrides=",">
      <if test="id != null">
        #{id,jdbcType=VARCHAR},
      </if>
      <if test="booknumber != null">
        #{booknumber,jdbcType=VARCHAR},
      </if>
      <if test="bookname != null">
        #{bookname,jdbcType=VARCHAR},
      </if>
      <if test="author != null">
        #{author,jdbcType=VARCHAR},
      </if>
      <if test="category != null">
        #{category,jdbcType=VARCHAR},
      </if>
      <if test="price != null">
        #{price,jdbcType=DOUBLE},
      </if>
      <if test="number != null">
        #{number,jdbcType=INTEGER},
      </if>
      <if test="soldoutnumber != null">
        #{soldoutnumber,jdbcType=INTEGER},
      </if>
      <if test="description != null">
        #{description,jdbcType=VARCHAR},
      </if>
      <if test="time != null">
        #{time,jdbcType=VARCHAR},
      </if>
      <if test="picture != null">
        #{picture,jdbcType=VARCHAR},
      </if>
      <if test="putintime != null">
        #{putintime,jdbcType=VARCHAR},
      </if>
      <if test="purchasenumber != null">
        #{purchasenumber,jdbcType=INTEGER},
      </if>
      <if test="note != null">
        #{note,jdbcType=VARCHAR},
      </if>
    </trim>
  </insert>
</mapper>
```

##### OrderMapper

```java
package com.ujs.bookcitydemo.mapper;

import com.ujs.bookcitydemo.entity.Order;
import com.ujs.bookcitydemo.entity.Trolley;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface OrderMapper {
    int deleteByPrimaryKey(String id);

    int insert(Order record);

    int insertSelective(Order record);

    Order selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(Order record);

    int updateByPrimaryKey(Order record);

    //查询指定表的所有数据
    List<Order> selectAll(@Param("tableName")String str);
    //查询指定表指定页面的数据
    List<Order> selectAllLimit(@Param("tableName") String str, @Param("start") int start, @Param("size")int size);
    //插入数据到特定表
    int insertOrder(@Param("tableName") String str,@Param("record") Order record);
}
```

##### OrderMapper.xml

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.ujs.bookcitydemo.mapper.OrderMapper">
  <resultMap id="BaseResultMap" type="com.ujs.bookcitydemo.entity.Order">
    <id column="id" jdbcType="VARCHAR" property="id" />
    <result column="orderid" jdbcType="VARCHAR" property="orderid" />
    <result column="bookid" jdbcType="VARCHAR" property="bookid" />
    <result column="booknumber" jdbcType="VARCHAR" property="booknumber" />
    <result column="bookname" jdbcType="VARCHAR" property="bookname" />
    <result column="author" jdbcType="VARCHAR" property="author" />
    <result column="category" jdbcType="VARCHAR" property="category" />
    <result column="price" jdbcType="DOUBLE" property="price" />
    <result column="number" jdbcType="INTEGER" property="number" />
    <result column="soldoutnumber" jdbcType="INTEGER" property="soldoutnumber" />
    <result column="description" jdbcType="VARCHAR" property="description" />
    <result column="time" jdbcType="VARCHAR" property="time" />
    <result column="picture" jdbcType="VARCHAR" property="picture" />
    <result column="userid" jdbcType="VARCHAR" property="userid" />
    <result column="username" jdbcType="VARCHAR" property="username" />
    <result column="password" jdbcType="VARCHAR" property="password" />
    <result column="email" jdbcType="VARCHAR" property="email" />
    <result column="phone" jdbcType="VARCHAR" property="phone" />
    <result column="address" jdbcType="VARCHAR" property="address" />
    <result column="avatar" jdbcType="VARCHAR" property="avatar" />
    <result column="vip" jdbcType="INTEGER" property="vip" />
    <result column="purchasetime" jdbcType="VARCHAR" property="purchasetime" />
    <result column="purchasenumber" jdbcType="INTEGER" property="purchasenumber" />
    <result column="note" jdbcType="VARCHAR" property="note" />
  </resultMap>
  <sql id="Base_Column_List">
    id, orderid, bookid, booknumber, bookname, author, category, price, number, soldoutnumber, 
    description, time, picture, userid, username, password, email, phone, address, avatar, 
    vip, purchasetime, purchasenumber, note
  </sql>
  <select id="selectAll" resultMap="BaseResultMap">
    select * from ${tableName}
  </select>
  <select id="selectAllLimit" resultMap="BaseResultMap">
    select
    *
    from ${tableName}
    limit #{start},#{size}
  </select>
  <select id="selectByPrimaryKey" parameterType="java.lang.String" resultMap="BaseResultMap">
    select 
    <include refid="Base_Column_List" />
    from order
    where id = #{id,jdbcType=VARCHAR}
  </select>
  <delete id="deleteByPrimaryKey" parameterType="java.lang.String">
    delete from order
    where id = #{id,jdbcType=VARCHAR}
  </delete>
  <insert id="insertOrder">
    insert into ${tableName} (id, orderid, bookid,
      booknumber, bookname, author,
      category, price, number,
      soldoutnumber, description, time,
      picture, userid, username,
      password, email, phone,
      address, avatar, vip,
      purchasetime, purchasenumber, note
      )
    values (#{record.id}, #{record.orderid}, #{record.bookid},
      #{record.booknumber}, #{record.bookname}, #{record.author},
      #{record.category}, #{record.price}, #{record.number},
      #{record.soldoutnumber}, #{record.description}, #{record.time},
      #{record.picture}, #{record.userid}, #{record.username},
      #{record.password}, #{record.email}, #{record.phone},
      #{record.address}, #{record.avatar}, #{record.vip},
      #{record.purchasetime}, #{record.purchasenumber}, #{record.note}
      )
  </insert>
  <insert id="insert" parameterType="com.ujs.bookcitydemo.entity.Order">
    insert into order (id, orderid, bookid, 
      booknumber, bookname, author, 
      category, price, number, 
      soldoutnumber, description, time, 
      picture, userid, username, 
      password, email, phone, 
      address, avatar, vip, 
      purchasetime, purchasenumber, note
      )
    values (#{id,jdbcType=VARCHAR}, #{orderid,jdbcType=VARCHAR}, #{bookid,jdbcType=VARCHAR}, 
      #{booknumber,jdbcType=VARCHAR}, #{bookname,jdbcType=VARCHAR}, #{author,jdbcType=VARCHAR}, 
      #{category,jdbcType=VARCHAR}, #{price,jdbcType=DOUBLE}, #{number,jdbcType=INTEGER}, 
      #{soldoutnumber,jdbcType=INTEGER}, #{description,jdbcType=VARCHAR}, #{time,jdbcType=VARCHAR}, 
      #{picture,jdbcType=VARCHAR}, #{userid,jdbcType=VARCHAR}, #{username,jdbcType=VARCHAR}, 
      #{password,jdbcType=VARCHAR}, #{email,jdbcType=VARCHAR}, #{phone,jdbcType=VARCHAR}, 
      #{address,jdbcType=VARCHAR}, #{avatar,jdbcType=VARCHAR}, #{vip,jdbcType=INTEGER}, 
      #{purchasetime,jdbcType=VARCHAR}, #{purchasenumber,jdbcType=INTEGER}, #{note,jdbcType=VARCHAR}
      )
  </insert>
  <insert id="insertSelective" parameterType="com.ujs.bookcitydemo.entity.Order">
    insert into order
    <trim prefix="(" suffix=")" suffixOverrides=",">
      <if test="id != null">
        id,
      </if>
      <if test="orderid != null">
        orderid,
      </if>
      <if test="bookid != null">
        bookid,
      </if>
      <if test="booknumber != null">
        booknumber,
      </if>
      <if test="bookname != null">
        bookname,
      </if>
      <if test="author != null">
        author,
      </if>
      <if test="category != null">
        category,
      </if>
      <if test="price != null">
        price,
      </if>
      <if test="number != null">
        number,
      </if>
      <if test="soldoutnumber != null">
        soldoutnumber,
      </if>
      <if test="description != null">
        description,
      </if>
      <if test="time != null">
        time,
      </if>
      <if test="picture != null">
        picture,
      </if>
      <if test="userid != null">
        userid,
      </if>
      <if test="username != null">
        username,
      </if>
      <if test="password != null">
        password,
      </if>
      <if test="email != null">
        email,
      </if>
      <if test="phone != null">
        phone,
      </if>
      <if test="address != null">
        address,
      </if>
      <if test="avatar != null">
        avatar,
      </if>
      <if test="vip != null">
        vip,
      </if>
      <if test="purchasetime != null">
        purchasetime,
      </if>
      <if test="purchasenumber != null">
        purchasenumber,
      </if>
      <if test="note != null">
        note,
      </if>
    </trim>
    <trim prefix="values (" suffix=")" suffixOverrides=",">
      <if test="id != null">
        #{id,jdbcType=VARCHAR},
      </if>
      <if test="orderid != null">
        #{orderid,jdbcType=VARCHAR},
      </if>
      <if test="bookid != null">
        #{bookid,jdbcType=VARCHAR},
      </if>
      <if test="booknumber != null">
        #{booknumber,jdbcType=VARCHAR},
      </if>
      <if test="bookname != null">
        #{bookname,jdbcType=VARCHAR},
      </if>
      <if test="author != null">
        #{author,jdbcType=VARCHAR},
      </if>
      <if test="category != null">
        #{category,jdbcType=VARCHAR},
      </if>
      <if test="price != null">
        #{price,jdbcType=DOUBLE},
      </if>
      <if test="number != null">
        #{number,jdbcType=INTEGER},
      </if>
      <if test="soldoutnumber != null">
        #{soldoutnumber,jdbcType=INTEGER},
      </if>
      <if test="description != null">
        #{description,jdbcType=VARCHAR},
      </if>
      <if test="time != null">
        #{time,jdbcType=VARCHAR},
      </if>
      <if test="picture != null">
        #{picture,jdbcType=VARCHAR},
      </if>
      <if test="userid != null">
        #{userid,jdbcType=VARCHAR},
      </if>
      <if test="username != null">
        #{username,jdbcType=VARCHAR},
      </if>
      <if test="password != null">
        #{password,jdbcType=VARCHAR},
      </if>
      <if test="email != null">
        #{email,jdbcType=VARCHAR},
      </if>
      <if test="phone != null">
        #{phone,jdbcType=VARCHAR},
      </if>
      <if test="address != null">
        #{address,jdbcType=VARCHAR},
      </if>
      <if test="avatar != null">
        #{avatar,jdbcType=VARCHAR},
      </if>
      <if test="vip != null">
        #{vip,jdbcType=INTEGER},
      </if>
      <if test="purchasetime != null">
        #{purchasetime,jdbcType=VARCHAR},
      </if>
      <if test="purchasenumber != null">
        #{purchasenumber,jdbcType=INTEGER},
      </if>
      <if test="note != null">
        #{note,jdbcType=VARCHAR},
      </if>
    </trim>
  </insert>
  <update id="updateByPrimaryKeySelective" parameterType="com.ujs.bookcitydemo.entity.Order">
    update order
    <set>
      <if test="orderid != null">
        orderid = #{orderid,jdbcType=VARCHAR},
      </if>
      <if test="bookid != null">
        bookid = #{bookid,jdbcType=VARCHAR},
      </if>
      <if test="booknumber != null">
        booknumber = #{booknumber,jdbcType=VARCHAR},
      </if>
      <if test="bookname != null">
        bookname = #{bookname,jdbcType=VARCHAR},
      </if>
      <if test="author != null">
        author = #{author,jdbcType=VARCHAR},
      </if>
      <if test="category != null">
        category = #{category,jdbcType=VARCHAR},
      </if>
      <if test="price != null">
        price = #{price,jdbcType=DOUBLE},
      </if>
      <if test="number != null">
        number = #{number,jdbcType=INTEGER},
      </if>
      <if test="soldoutnumber != null">
        soldoutnumber = #{soldoutnumber,jdbcType=INTEGER},
      </if>
      <if test="description != null">
        description = #{description,jdbcType=VARCHAR},
      </if>
      <if test="time != null">
        time = #{time,jdbcType=VARCHAR},
      </if>
      <if test="picture != null">
        picture = #{picture,jdbcType=VARCHAR},
      </if>
      <if test="userid != null">
        userid = #{userid,jdbcType=VARCHAR},
      </if>
      <if test="username != null">
        username = #{username,jdbcType=VARCHAR},
      </if>
      <if test="password != null">
        password = #{password,jdbcType=VARCHAR},
      </if>
      <if test="email != null">
        email = #{email,jdbcType=VARCHAR},
      </if>
      <if test="phone != null">
        phone = #{phone,jdbcType=VARCHAR},
      </if>
      <if test="address != null">
        address = #{address,jdbcType=VARCHAR},
      </if>
      <if test="avatar != null">
        avatar = #{avatar,jdbcType=VARCHAR},
      </if>
      <if test="vip != null">
        vip = #{vip,jdbcType=INTEGER},
      </if>
      <if test="purchasetime != null">
        purchasetime = #{purchasetime,jdbcType=VARCHAR},
      </if>
      <if test="purchasenumber != null">
        purchasenumber = #{purchasenumber,jdbcType=INTEGER},
      </if>
      <if test="note != null">
        note = #{note,jdbcType=VARCHAR},
      </if>
    </set>
    where id = #{id,jdbcType=VARCHAR}
  </update>
  <update id="updateByPrimaryKey" parameterType="com.ujs.bookcitydemo.entity.Order">
    update order
    set orderid = #{orderid,jdbcType=VARCHAR},
      bookid = #{bookid,jdbcType=VARCHAR},
      booknumber = #{booknumber,jdbcType=VARCHAR},
      bookname = #{bookname,jdbcType=VARCHAR},
      author = #{author,jdbcType=VARCHAR},
      category = #{category,jdbcType=VARCHAR},
      price = #{price,jdbcType=DOUBLE},
      number = #{number,jdbcType=INTEGER},
      soldoutnumber = #{soldoutnumber,jdbcType=INTEGER},
      description = #{description,jdbcType=VARCHAR},
      time = #{time,jdbcType=VARCHAR},
      picture = #{picture,jdbcType=VARCHAR},
      userid = #{userid,jdbcType=VARCHAR},
      username = #{username,jdbcType=VARCHAR},
      password = #{password,jdbcType=VARCHAR},
      email = #{email,jdbcType=VARCHAR},
      phone = #{phone,jdbcType=VARCHAR},
      address = #{address,jdbcType=VARCHAR},
      avatar = #{avatar,jdbcType=VARCHAR},
      vip = #{vip,jdbcType=INTEGER},
      purchasetime = #{purchasetime,jdbcType=VARCHAR},
      purchasenumber = #{purchasenumber,jdbcType=INTEGER},
      note = #{note,jdbcType=VARCHAR}
    where id = #{id,jdbcType=VARCHAR}
  </update>
</mapper>
```

#### Util

##### CodeGenerateUtil

```java
package com.ujs.bookcitydemo.Util;

import java.security.SecureRandom;
import java.util.Random;

public class CodeGenerateUtil {
    private static final String SYMBOLS = "0123456789";
    private static final Random RANDOM = new SecureRandom();

    /**
     * 生成6位随机数字
     * @return 返回6位数字验证码
     */
    public static String generateVerCode() {
        char[] nonceChars = new char[6];
        for (int index = 0; index < nonceChars.length; ++index) {
            nonceChars[index] = SYMBOLS.charAt(RANDOM.nextInt(SYMBOLS.length()));
        }
        return new String(nonceChars);
    }
}
```

##### BookSortBySoldOutNumber

```java
package com.ujs.bookcitydemo.Util;

import com.ujs.bookcitydemo.entity.Book;

import java.util.Comparator;

public class BookSortBySoldOutNumber implements Comparator<Book> {

    @Override
    public int compare(Book o1, Book o2) {
        int number1= o1.getSoldoutnumber();
        int number2=o2.getSoldoutnumber();
        if(number1>number2) return -1;
        else if(number1<number2) return 1;
        else return 0;
    }
}
```

##### BookSortByTime

```java
package com.ujs.bookcitydemo.Util;

import com.ujs.bookcitydemo.entity.Book;

import java.util.Comparator;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class BookSortByTime implements Comparator<Book> {
    @Override
    public int compare(Book o1, Book o2) {
        String fullStr1=o1.getTime();
        String fullStr2=o2.getTime();
        //使用正则表达式获取所有数字
        String rule="[^0-9]";
        Pattern pattern=Pattern.compile(rule);
        Matcher matcher1=pattern.matcher(fullStr1);
        Matcher matcher2= pattern.matcher(fullStr2);
        long number1= Long.parseLong(matcher1.replaceAll("").trim());
        long number2= Long.parseLong(matcher2.replaceAll("").trim());

        if(number1> number2) return -1;
        if(number1<number2) return 1;
        return 0;
    }
}
```

##### DisplayByPages

```java
package com.ujs.bookcitydemo.Util;

import com.ujs.bookcitydemo.entity.Book;
import com.ujs.bookcitydemo.entity.PageInfo;
import org.springframework.ui.Model;

import java.util.LinkedList;
import java.util.List;

public class DisplayByPages {
    static int pageSize=5;//每页显示数据项数量

    public static int getPageSize() {
        return pageSize;
    }

    /*分页方法*/
    public PageInfo<?> pageInfo(int currentPage, List<?> list,int totalCount) {
        PageInfo pageInfo = new PageInfo();

        int size=pageSize;
        if(totalCount==0){
            totalCount=1;
        }

        //向上取整得到totalPage
        int totalPage;
        if (totalCount%size!=0){
            totalPage = totalCount/size+1;
        }else {
            totalPage=totalCount/size;
        }
        //页面号不小于1且小于最大页面号
        if(currentPage < 1) {
            currentPage = 1;
        }
        else if(currentPage > totalPage) {
            currentPage = totalPage;
        }

        pageInfo.setTotalCount(totalCount);
        pageInfo.setSize(size);
        pageInfo.setTotalPage(totalPage);
        pageInfo.setCurrentPage(currentPage);
        pageInfo.setList(list);

        return pageInfo;
    }
    /*添加相应数据到Model*/
    public Model pageModel(Model model, List<?> list, int currentPage, int pageCount, String str){
        int pagePrev=currentPage>1?currentPage-1:1;//上一页
        int pageNext=currentPage<pageCount?currentPage+1:pageCount;//下一页
        model.addAttribute("list", list);
        model.addAttribute("pageNo", currentPage);
        model.addAttribute("pageCount", pageCount);
        model.addAttribute("pagePrev", pagePrev);
        model.addAttribute("pageNext", pageNext);
        model.addAttribute("str",str);
        return model;
    }
}
```

##### ListUtil

```java
package com.ujs.bookcitydemo.Util;

import java.util.HashSet;
import java.util.List;

public class ListUtil {
    public List removeDuplicate(List list) {
        HashSet h = new HashSet(list);
        list.clear();
        list.addAll(h);
        System.out.println(list);
        return list;
    }
}
```

##### UserRealm

```java
package com.ujs.bookcitydemo.Util;

import com.ujs.bookcitydemo.entity.User;
import com.ujs.bookcitydemo.service.UserService;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;


/**
 * 自定义Realm
 */
public class UserRealm extends AuthorizingRealm {

    @Autowired(required = false)
    private UserService userService;

    private final Logger logger = LoggerFactory.getLogger(UserRealm.class);

    /**
     * 执行授权逻辑
     *
     * @param arg0
     * @return
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection arg0) {
        System.out.println("执行授权逻辑");
        //给资源进行授权
        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        //不授权先不写
        return info;
    }

    /**
     * 执行认证逻辑
     *
     * @param arg0
     * @return
     * @throws AuthenticationException
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken arg0) throws AuthenticationException {
        System.out.println("执行认证逻辑"); // 编写shiro判断逻辑，判断用户名和密码
        UsernamePasswordToken token = (UsernamePasswordToken) arg0; // 判断用户名
        User user = userService.getUserByName(token.getUsername());
        if (user == null) { // 该用户不存在
            return null; // shiro底层会抛出UnKnowAccountException
        }
        return new SimpleAuthenticationInfo(user, user.getPassword(), ""); // 判断密码
    }

}
```

##### Apriori

```language
一种通过频繁项集来挖掘关联规则的算法，实现推荐书籍的功能
```

```java
package com.ujs.bookcitydemo.Util;

import com.ujs.bookcitydemo.entity.Order;
import com.ujs.bookcitydemo.entity.User;
import com.ujs.bookcitydemo.service.OrderService;
import com.ujs.bookcitydemo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.*;

public class Apriori {

    static ArrayList<ArrayList<String>> D = new ArrayList<ArrayList<String>>();// 事务数据库
    static HashMap<ArrayList<String>, Double> C = new HashMap<ArrayList<String>, Double>();// 项目集
    static HashMap<ArrayList<String>, Double> L = new HashMap<ArrayList<String>, Double>();// 候选集
    static double min_support = 0.5;// 最小支持度
    static double min_confident = 0.7;// 最小置信度

    // 用于存取候选集每次计算结果，最后计算关联规则
    static HashMap<ArrayList<String>, Double> L_ALL = new HashMap<ArrayList<String>, Double>();
    // 关联规则
    static HashMap<ArrayList<String>, ArrayList<String>> RESULT = new HashMap<ArrayList<String>, ArrayList<String>>();

    // 剪枝步，删去C少于最小支持度的元素，形成L
    public void pruning(HashMap<ArrayList<String>, Double> C,
                        HashMap<ArrayList<String>, Double> L) {
        L.clear();
        // 根据项目集生成候选集
        L.putAll(C);
        // 删除少于最小支持度的元素
        ArrayList<ArrayList<String>> delete_key = new ArrayList<ArrayList<String>>();
        for (ArrayList<String> key : L.keySet()) {
            if (L.get(key) < min_support) {
                delete_key.add(key);
            }
        }
        for (int i = 0; i < delete_key.size(); i++) {
            L.remove(delete_key.get(i));
        }
    }

    /**
     * 初始化事务数据库、项目集、候选集
     */
    public void init(List<User> userList,ArrayList<List<Order>> orderLists) {

        // 将所有用户的所有订单信息放到事务数据库中
        for (int i = 0; i < orderLists.size(); i++) {
            ArrayList<String> item = new ArrayList<String>();
            for (int j = 0; j < orderLists.get(i).size(); j++) {
                String e=orderLists.get(i).get(j).getBookid();
                item.add(e);
            }
            D.add(item);
        }

        // 扫描事务数据库。生成项目集，支持度=改元素在事务数据库出现的次数/事务数据库的事务数
        for (int i = 0; i < D.size(); i++) {
            for (int j = 0; j < D.get(i).size(); j++) {
                String[] e = { D.get(i).get(j) };
                ArrayList<String> item = new ArrayList<String>(Arrays.asList(e));
                if (!C.containsKey(item)) {
                    C.put(item, 1.0 / D.size());
                } else {
                    C.put(item, C.get(item) + 1.0 / D.size());
                }
            }
        }

        pruning(C, L);// 剪枝

        L_ALL.putAll(L);

    }

    // 两个整数集求并集
    public ArrayList<String> arrayListUnion(
            ArrayList<String> arraylist1, ArrayList<String> arraylist2) {
        ArrayList<String> arraylist = new ArrayList<String>();
        arraylist.addAll(arraylist1);
        arraylist.addAll(arraylist2);
        arraylist = new ArrayList<String>(new HashSet<String>(arraylist));
        return arraylist;
    }

    /**
     * 迭代求出最终的候选频繁集
     *
     * @param C
     *            完成初始化的项目集
     * @param L
     *            完成初始化的候选集
     * @return 最终的候选频繁集
     */
    public HashMap<ArrayList<String>, Double> iteration(
            HashMap<ArrayList<String>, Double> C,
            HashMap<ArrayList<String>, Double> L) {
        HashMap<ArrayList<String>, Double> L_temp = new HashMap<ArrayList<String>, Double>();// 用于判断是否结束剪枝的临时变量

        int t = 1;// 迭代次数
        while (L.size() > 0) {// 一旦被剪枝后剪干净，剪枝之前则是最终要求的结果。
            t++;
            L_temp.clear();
            L_temp.putAll(L);
            // 一、连接步
            C.clear();
            // 1.将L中的项以一定的规则两两匹配
            ArrayList<ArrayList<String>> L_key = new ArrayList<ArrayList<String>>(
                    L.keySet());
            for (int i = 0; i < L_key.size(); i++) {
                for (int j = i + 1; j < L_key.size(); j++) {
                    ArrayList<String> C_item = new ArrayList<String>();
                    C_item = new ArrayList<String>(arrayListUnion(L_key.get(i),
                            L_key.get(j)));
                    if (C_item.size() == t) {
                        C.put(C_item, 0.0);// 频繁项集的所有非空子集都必须是频繁的
                    }
                }
            }
            // 2.通过扫描D，计算此项的支持度
            for (ArrayList<String> key : C.keySet()) {
                for (int i = 0; i < D.size(); i++) {
                    if (D.get(i).containsAll(key)) {
                        C.put(key, C.get(key) + 1.0 / D.size());
                    }
                }
            }
            // System.out.println(C);
            // 二、剪枝步
            pruning(C, L);
            // System.out.println(L);
            // System.out.println("===");

            L_ALL.putAll(L);
        }

        return L_temp;
    }

    // 求一个集合的所有子集
    public ArrayList<ArrayList<String>> getSubset(ArrayList<String> L) {
        if (L.size() > 0) {
            ArrayList<ArrayList<String>> result = new ArrayList<ArrayList<String>>();
            for (int i = 0; i < Math.pow(2, L.size()); i++) {// 集合子集个数=2的该集合长度的乘方
                ArrayList<String> subSet = new ArrayList<String>();
                int index = i;// 索引从0一直到2的集合长度的乘方-1
                for (int j = 0; j < L.size(); j++) {
                    // 通过逐一位移，判断索引那一位是1，如果是，再添加此项
                    if ((index & 1) == 1) {// 位与运算，判断最后一位是否为1
                        subSet.add(L.get(j));
                    }
                    index >>= 1;// 索引右移一位
                }
                result.add(subSet); // 把子集存储起来
            }
            return result;
        } else {
            return null;
        }
    }

    // 判断两个集合相交是否为空
    public static boolean intersectionIsNull(ArrayList<String> l1,
                                             ArrayList<String> l2) {
        Set<String> s1 = new HashSet<String>(l1);
        Set<String> s2 = new HashSet<String>(l2);

        s1.retainAll(s2);
        if (s1.size() > 0) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 根据最终的关联集，根据公式计算出各个关联事件
     */
    public void connection() {
        for (ArrayList<String> key : L.keySet()) {// 对最终的关联集各个事件进行判断
            ArrayList<ArrayList<String>> key_allSubset = getSubset(key);
            // System.out.println(key_allSubset);
            for (int i = 0; i < key_allSubset.size(); i++) {
                ArrayList<String> item_pre = key_allSubset.get(i);
                if (0 < item_pre.size() && item_pre.size() < key.size()) {// 求其非空真子集
                    // 各个非空互补真子集之间形成关联事件
                    double item_pre_support = L_ALL.get(item_pre);
                    for (int j = 0; j < key_allSubset.size(); j++) {
                        ArrayList<String> item_post = key_allSubset.get(j);
                        if (0 < item_post.size()
                                && item_post.size() < key.size()
                                && arrayListUnion(item_pre, item_post).equals(key)
                                && intersectionIsNull(item_pre, item_post)) {

                            double item_post_support = L_ALL.get(item_post);// 互补真子集的支持度比则是事件的置信度
//                            double confident = item_pre_support / item_post_support; // 事件的置信度
                            //置信度理解有误，这里做出更改
                            double item_pre_num=0;
                            for (int k = 0; k < D.size(); k++) {
                                if (D.get(k).containsAll(item_pre)) {
                                    item_pre_num++;
                                }
                            }
                            double item_post_num=0;
                            for (int k = 0; k < D.size(); k++) {
                                if (D.get(k).containsAll(item_pre)&&D.get(k).containsAll(item_post)) {
                                    item_post_num++;
                                }
                            }
                            double confident=item_post_num/item_pre_num;// 事件的置信度
                            //更改结束

                            if (confident > min_confident) {// 如果事件的置信度大于最小置信度
                                System.out.println(item_pre + "==>" + item_post);// 则是一个关联事件
                                // 存放关联规则
                                RESULT.put(item_pre,item_post);
                            }
                        }

                    }
                }
            }
        }
    }

    // 获取结果
    public HashMap<ArrayList<String>, ArrayList<String>> getResult(List<User> userList,ArrayList<List<Order>> orderLists){
        init(userList, orderLists);
        L = iteration(C, L);
        connection();
        return RESULT;
    }

}
```

![Apriori算法](Apriori.jpg)

#### Config

##### KaptchaConfig

```java
package com.ujs.bookcitydemo.config;

import com.google.code.kaptcha.impl.DefaultKaptcha;
import com.google.code.kaptcha.util.Config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Properties;

@Configuration
public class KaptchaConfig {
    @Bean
    public DefaultKaptcha getDefaultKaptcha() {
        DefaultKaptcha defaultKaptcha = new DefaultKaptcha();
        Properties properties = new Properties();
        // 图片边框
        properties.setProperty("kaptcha.border", "yes");
        // 边框颜色
        properties.setProperty("kaptcha.border.color", "105,179,90");
        // 字体颜色
        properties.setProperty("kaptcha.textproducer.font.color", "black");
        // 图片宽
        properties.setProperty("kaptcha.image.width", "110");
        // 图片高
        properties.setProperty("kaptcha.image.height", "40");
        // 字体大小
        properties.setProperty("kaptcha.textproducer.font.size", "30");
        // session key
        properties.setProperty("kaptcha.session.key", "code");
        // 验证码长度
        properties.setProperty("kaptcha.textproducer.char.length", "4");
        // 字体
        properties.setProperty("kaptcha.textproducer.font.names", "宋体,楷体,微软雅黑");
        Config config = new Config(properties);
        defaultKaptcha.setConfig(config);

        return defaultKaptcha;
    }
}
```



##### ShiroConfig

```java
package com.ujs.bookcitydemo.config;

import java.util.LinkedHashMap;
import java.util.Map;

import com.ujs.bookcitydemo.Util.UserRealm;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


/**
 * Shiro的配置类
 */
@Configuration
public class ShiroConfig {

    /**
     * 创建ShiroFilterFactoryBean
     *
     * @param securityManager
     * @return
     */
    @Bean
    public ShiroFilterFactoryBean getShiroFilterFactoryBean(@Qualifier("securityManager") DefaultWebSecurityManager securityManager) {
        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
        //设置安全管理器
        shiroFilterFactoryBean.setSecurityManager(securityManager);

        //添加Shiro内置过滤器
        /**
         * Shiro内置过滤器，可以实现权限相关的拦截器
         *    常用的过滤器：
         *       anon: 无需认证（登录）可以访问
         *       authc: 必须认证才可以访问
         *       user: 如果使用rememberMe的功能可以直接访问
         *       perms： 该资源必须得到资源权限才可以访问
         *       role: 该资源必须得到角色权限才可以访问
         */

        Map<String, String> filterMap = new LinkedHashMap<String, String>();
        // 放行登录页面和主页
        filterMap.put("/user/enterLogin", "anon"); // 要将登陆的接口放出来，不然没权限访问登陆的接口
        filterMap.put("/", "anon");
        // 授权过滤器
        // 注意：当前授权拦截后，shiro会自动跳转到未授权页面
        filterMap.put("/trolley/**", "authc");
        filterMap.put("/order/**", "authc");

        shiroFilterFactoryBean.setLoginUrl("/user/enterLogin"); // 修改调整的登录页面
        shiroFilterFactoryBean.setUnauthorizedUrl("/404"); // 设置未授权提示页面
        shiroFilterFactoryBean.setFilterChainDefinitionMap(filterMap);
        return shiroFilterFactoryBean;
    }

    /**
     * 创建DefaultWebSecurityManager
     *
     * @param userRealm
     * @return
     */
    @Bean(name = "securityManager")
    public DefaultWebSecurityManager getDefaultWebSecurityManager(@Qualifier("userRealm") UserRealm userRealm) {
        DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
        securityManager.setRealm(userRealm); // 关联realm
        return securityManager;
    }

    /**
     * 创建Realm
     *
     * @return
     */
    @Bean(name = "userRealm")
    public UserRealm getRealm() {
        return new UserRealm();
    }

}
```

##### AlipayConfig

```java
package com.ujs.bookcitydemo.config;

import java.io.FileWriter;
import java.io.IOException;

public class AlipayConfigInfo {
    // 应用ID,您的APPID，收款账号既是您的APPID对应支付宝账号
    public static String app_id="2016102700771439";
    // 商户私钥，您的PKCS8格式RSA2私钥
    public static String merchant_private_key = "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDS+95TLNSKyYxg28cPny9TNmtvGT1wPBGITclzkslUyFnNxKP9TG0NMXleigv92oDxelJW9kN5njX/ogIlX0SfDljxsT1eBoFdsqu73DnTpbNkNzX+SKl+XANKs0FA3ARAcvff+2JOXpB783V+OmPwXRS69gBRsLfh04gh8tp3tQ2gWYPPyquOSvieia1rk8G7Led9QLtT4PyZMihW4xQinRVDyWD6Eu8yINrN0llHspxJvJCz9fsbW1J4XpjXunHt+80PWb90V/BV7txHrX9XrW+QfH8lXFKQvLugAFX2VgYB+4bvaQcYqTS9VDJQWwz64A4qwh7VlEhqGWY/IpkBAgMBAAECggEANsN/stE5Hgkwsdd6NPjZvNysSDsh8mb1Gg8u0hvwvFwAy2NWOaJD0B/eZAarFCpKO+PHSaFEZGYHmCICMpcm5a5AsgOSbTx9CcgdwXZpYCFrjgCyuB0+OXlCtXoP3vj89YmiA3ZpzvPGxxWrkqcvV62heuHttUaMhEZ22HED+fwA7GW+hQgPLAQLzRehlM/eu9oKV5gDOt79ixPu/Bqk4DV7bIOLwzxYjUUfCrXeymwNb5VuDIQdZlD8//laKxYXaZKJohrkaeG1yDbv30uYBfWgiJlVYYOfex5Lxt/KxxGS4zqzw9n81qzzcNzauYcVDvZ5HkbsVpWNfZ5sr8JrQQKBgQD5CtwaZGDY9NJBuf3FiHYJP9yzUlpyGqshE8W82P9oid7jztFe5ngGcl5oEyFftTT+x41zt2V2J5HEiEI1eOAjl7r7UDgO5ffeuHJ4QJUBEveSFos1kY2I/+b48ESiX16AhGmKEkxfnUyXZ+0zldBC/MtthTYsrdYsr+GbOxYIaQKBgQDY4NDI9F3LnZd6Piwfj+ck+YmLbXyGEZUzyHXDsaI43Vipm98B5jcm6FY5udHdWc2acamDUjixs6hGsjVtffC04u7MeEHum2A1lWilIGa2rdk89ZpVh1T+xKcBKu53ouFmYxMzBF0ZXQanByw4MgUN1UZF8xgPBtysABtvmtq42QKBgEtS+4uH/LriIY37oUPTqE/X3vrl17FXW5cfkdkykN2fhajFbxITBw58HQ3Ba4C1IBhHZwMu3yNDiJU22T+vFavuQoGsm6f16miUxRqV/ftbL0IiS2yiX3qmW8fDdB7gVYbthbZbHnp06yuIJXhKwbjhGO5BMkeFNJhDgisfTeSxAoGBAIpZh/bZpEfy5SGvLZiIxQwaP3r5QhmId+SLuUw4MeMSmK/B5lYg1Qf16KN0fYM1+WnPnjJOrin2EJ/gqSKK15WcuncnM/ARoCMuh43nCH76kf1IM8bhyP+o1VxyVaNt/VnCVAoUe4tlg4vjkHrctcqoRebzd2KGnxj+DIJ6h5KpAoGARRUMdK9NE3pmI+d4A0GeONG6/UXtIySc6SLMyjNueX7fvKmkcnhJUq+Fj4O/Nci6/dSUWKzQz5uJ5s1O878He+i+m3S/GUgDcKtvtvsNGdAwbQWuA4R2xguuPYAgfAaiucCrc8GhK4RDRNIJK/J2fbManqYidMMed0xZYwMaDec=";
    // 支付宝公钥,查看地址：https://openhome.alipay.com/platform/keyManage.htm
    // 对应APPID下的支付宝公钥。
    public static String alipay_public_key = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmTYUWfgfso78O9iz4o250Wf7Ta1dgi85fjpCs/jYWzz3T+7OjtQNSiFY9GIxOZJbO35pvBt8oAn5ZwNB3dwLbsCSGd35E8bGa4tClrwyq6IuDgPyKnEz9F8z5lmhjCZQWmKQmNAY1+gnSdYhStyo2A95NPkdUjq7W/facMkRCfuy/JIOOd0w/2YL+4zxnEnkEaZQ2KzGCM5wKMopxCJW7dJVoRnEHhkmKE1xCULUhJz55CFuBbrdk6gPUhUQMuacREp0ggdk5RhCTXhMzhJ6Ld1VK1omv1ag9qqeijLomfiLLSg71y2TOHyfZVEjz5qJopH8YZQHI2srOFDrk0RZSwIDAQAB";
    // 服务器异步通知页面路径 需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
    /**
     * 返回的时候此页面不会返回到用户页面，只会执行你写到控制器里的地址
     */
    public static String notify_url="http://localhost:8080/order/addToOrder";
    // 页面跳转同步通知页面路径 需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
    /**
     * 此页面是同步返回用户页面，也就是用户支付后看到的页面，上面的notify_url是异步返回商家操作
     */
    public static String return_url = "http://localhost:8080";
    // 签名方式
    public static String sign_type = "RSA2";
    // 字符编码格式
    public static String charset = "utf-8";
    // 支付宝网关
    public static String gatewayUrl="https://openapi.alipaydev.com/gateway.do";
    // 日志地址,这里在d盘下要创建这个文件,不然会报错
    public static String log_path = "E:/logs/";

    /**
     * 日志
     *
     * @param sWord
     *            要写入日志里的文本内容
     */
    public static void logResult(String sWord) {
        FileWriter writer = null;
        try {
            writer = new FileWriter(log_path + "alipay_log_"
                    + System.currentTimeMillis() + ".txt");
            writer.write(sWord);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (writer != null) {
                try {
                    writer.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```

#### application.properties

```properties
# 应用名称
spring.application.name=book-city-demo
# 应用服务 WEB 访问端口
server.port=8080

# 日志配置
logging.config=classpath:logback.xml
logging.file.path=E:/logs

# 默认路径
spring.thymeleaf.prefix=classpath:/templates/
# 后缀
spring.thymeleaf.suffix=.html
# 模板格式
spring.thymeleaf.mode=HTML5
spring.thymeleaf.encoding=UTF-8
spring.thymeleaf.content-type=text/html
spring.thymeleaf.cache=false

#配置数据库连接信息
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/bookcity?serverTimezone=GMT%2B8
spring.datasource.username=bookcity
spring.datasource.password=lz2001031910167

#邮件发送配置
spring.mail.default-encoding=UTF-8
spring.mail.host=smtp.qq.com
spring.mail.username=2382314021@qq.com
spring.mail.password=wowmojcnlrzgdjbi
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
```

#### logback.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration scan="true" scanPeriod="60 seconds" debug="false">
    <!-- 定义日志文件 输入位置 -->
    <property name="log_dir" value="E:/logs" />
    <!-- 日志最大的历史 30天 -->
    <property name="maxHistory" value="30"/>

    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger -%msg%n</pattern>
        </encoder>
    </appender>

    <appender name="ERROR" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>ERROR</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${log_dir}/%d{yyyy-MM-dd}/error-log.log</fileNamePattern>
            <maxHistory>${maxHistory}</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger - %msg%n</pattern>
        </encoder>
    </appender>

    <appender name="INFO" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>INFO</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${log_dir}/%d{yyyy-MM-dd}/info-log.log</fileNamePattern>
            <maxHistory>${maxHistory}</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger - %msg%n</pattern>
        </encoder>
    </appender>

    <appender name="DEBUG" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>DEBUG</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${log_dir}/%d{yyyy-MM-dd}/debug-log.log</fileNamePattern>
            <maxHistory>${maxHistory}</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger - %msg%n</pattern>
        </encoder>
    </appender>

    <logger name="com.ujs" level="debug"/>

    <root level="debug">
        <appender-ref ref="STDOUT" />
        <appender-ref ref="ERROR" />
        <appender-ref ref="INFO" />
        <appender-ref ref="DEBUG" />
    </root>
</configuration>
```

#### BookCityDemoApplication

```java
package com.ujs.bookcitydemo;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan(basePackages = "com.ujs.bookcitydemo.mapper")
public class BookCityDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookCityDemoApplication.class, args);
    }

}
```

### 前端实现

```language
导入Bootstrap和jQuery
```



#### index

##### index.html

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>黑大帅书城</title>
<!--    <script src="https://code.jquery.com/jquery-3.6.0.js"-->
<!--            integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk="-->
<!--            crossorigin="anonymous"></script>-->
    <script src="../../static/js/jquery.js" th:src="@{/js/jquery.js}"></script>
    <link rel="stylesheet" href="../../static/css/index.css" th:href="@{/css/index.css}">
    <link rel="stylesheet" href="../../static/css/public.css" th:href="@{/css/public.css}">
    <link rel="stylesheet" href="../../static/css/bootstrap.css" th:href="@{/css/bootstrap.css}">
    <script src="../../static/js/bootstrap.js" th:src="@{/js/bootstrap.js}"></script>
</head>
<body>
<div>
    <!--    导航栏-->
    <nav class="navbar navbar-default" th:fragment="navbarIndex">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                        data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#">黑大帅书城</a>
            </div>

            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav">
                    <li class="active"><a th:href="@{'/'}">主页<span class="sr-only">(current)</span></a></li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                           aria-expanded="false">分类<span class="caret"></span>
                        </a>
                        <ul class="dropdown-menu">
                            <li><a href="#" th:href="@{'/book/enterBookList?requestPage=文学'}">文学</a></li>
                            <li><a href="#" th:href="@{'/book/enterBookList?requestPage=心理'}">心理</a></li>
                            <li><a href="#" th:href="@{'/book/enterBookList?requestPage=法律'}">法律</a></li>
                            <li><a href="#" th:href="@{'/book/enterBookList?requestPage=历史'}">历史</a></li>
                            <li><a href="#" th:href="@{'/book/enterBookList?requestPage=爱情'}">爱情</a></li>
                            <li><a href="#" th:href="@{'/book/enterBookList?requestPage=成长'}">成长</a></li>
                            <li><a href="#" th:href="@{'/book/enterBookList?requestPage=推理'}">推理</a></li>
                            <li><a href="#" th:href="@{'/book/enterBookList?requestPage=艺术'}">艺术</a></li>
                            <li><a href="#" th:href="@{'/book/enterBookList?requestPage=科幻'}">科幻</a></li>
                            <li><a href="#" th:href="@{'/book/enterBookList?requestPage=经济'}">经济</a></li>
                            <li><a href="#" th:href="@{'/book/enterBookList?requestPage=美食'}">美食</a></li>
                            <li><a href="#" th:href="@{'/book/enterBookList?requestPage=哲学'}">哲学</a></li>
                            <!--                            <li role="separator" class="divider"></li>-->
                            <!--                            <li><a href="#"></a></li>-->
                            <!--                            <li role="separator" class="divider"></li>-->
                            <!--                            <li><a href="#">其他</a></li>-->
                        </ul>
                    </li>
                    <li><a href="#" th:href="@{'/book/enterBookList?requestPage=新品'}">新品</a></li>
                    <li><a href="#" th:href="@{'/book/enterBookList?requestPage=热销'}">热销</a></li>
                </ul>
                <form class="navbar-form navbar-left" action="/book/queryBookList">
                    <div class="form-group">
                        <input type="text" name="inputBookMessage" class="form-control" placeholder="Search">
                    </div>
                    <button type="submit" class="btn btn-default">搜索</button>
                </form>
                <ul class="nav navbar-nav navbar-right">
                    <li><a href="/trolley/enterTrolleyList">购物车</a></li>
                    <li class="dropdown" th:if="${session.USER_INFO}">
                        <a href="" class="dropdown-toggle" data-toggle="dropdown" role="button"
                           aria-haspopup="true"
                           aria-expanded="false">
                            <div th:text="${session.USER_INFO.getUsername()}">登录</div>
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <a href="/user/enterUserCenter" th:if="${session.USER_INFO.getAvatar()}">
                                    <img th:src="@{'/picture/'+${session.USER_INFO.getAvatar()}}"
                                         width="35" height="35" alt="avatar">
                                </a>
                                <a href="/user/enterUserCenter" th:unless="${session.USER_INFO.getAvatar()}">
                                    <img th:src="@{'/picture/defaultAvatar.jpg'}"
                                         width="35" height="35" alt="avatar">
                                </a>
                            </li>
                            <li><a href="/order/enterOrderList">订单</a></li>
                            <li><a href="/user/enterUserCenter">设置</a></li>
                            <li role="separator" class="divider"></li>
                            <li><a href="/user/exitLogin">退出</a></li>

                        </ul>
                    </li>
                    <li class="dropdown" th:unless="${session.USER_INFO}">
                        <a href="/user/enterLogin" class="dropdown-toggle">登录</a>
                    </li>


                </ul>
            </div>
        </div>
    </nav>
    <!--    轮播图-->
    <div class="customizeCarouselLocation">
        <div id="myCarousel" class="carousel slide">
            <!-- 轮播（Carousel）指标 -->
            <ol class="carousel-indicators">
                <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
                <li data-target="#myCarousel" data-slide-to="1"></li>
                <li data-target="#myCarousel" data-slide-to="2"></li>
            </ol>
            <!-- 轮播（Carousel）项目 -->
            <div class="carousel-inner">
                <div class="item active">
                    <img src="../../static/picture/1.jpg" th:src="@{/picture/1.jpg}" alt="First slide">
                </div>
                <div class="item">
                    <img src="../../static/picture/2.jpg" th:src="@{/picture/2.jpg}" alt="Second slide">
                </div>
                <div class="item">
                    <img src="../../static/picture/3.jpg" th:src="@{/picture/3.jpg}" alt="Third slide">
                </div>
            </div>
            <!-- 轮播（Carousel）导航 -->
            <a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">
                <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
            </a>
            <a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">
                <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
            </a>
        </div>
    </div>

    <!--畅销榜-->
    <div class="customizeHotProduct">
        <div class="row">
            <div class="col-sm-6 col-md-3">
                <div>
                    <div><h1>1</h1></div>
                    <div>
                        <div th:text="${session.HOTBOOK_LIST.get(0).getBookname()}">
                            百年孤独
                        </div>
                    </div>
                    <div th:text="${session.HOTBOOK_LIST.get(0).getAuthor()}">作者：马克吐温</div>
                    <div class="col-sm-6 col-md-8">
                        <a href="#" class="thumbnail"
                           th:href="@{'/book/enterBookMessage?requestBook='+${session.HOTBOOK_LIST.get(0).getId()}}">
                            <img src="../../static/picture/hot1.jpg"
                                 th:src="@{'/picture/book/'+${session.HOTBOOK_LIST.get(0).getPicture()}}">
                        </a>
                    </div>

                </div>

            </div>
            <div class="col-sm-6 col-md-3">
                <div>
                    <div><h1>2</h1></div>
                    <div>
                        <div th:text="${session.HOTBOOK_LIST.get(1).getBookname()}">
                            百年孤独
                        </div>
                    </div>
                    <div th:text="${session.HOTBOOK_LIST.get(1).getAuthor()}">作者：马克吐温</div>
                    <div class="col-sm-6 col-md-8">
                        <a href="#" class="thumbnail"
                           th:href="@{'/book/enterBookMessage?requestBook='+${session.HOTBOOK_LIST.get(1).getId()}}">
                            <img src="../../static/picture/hot1.jpg"
                                 th:src="@{'/picture/book/'+${session.HOTBOOK_LIST.get(1).getPicture()}}">
                        </a>
                    </div>

                </div>

            </div>
            <div class="col-sm-6 col-md-3">
                <div>
                    <div><h1>3</h1></div>
                    <div>
                        <div th:text="${session.HOTBOOK_LIST.get(2).getBookname()}">
                            百年孤独
                        </div>
                    </div>
                    <div th:text="${session.HOTBOOK_LIST.get(2).getAuthor()}">作者：马克吐温</div>
                    <div class="col-sm-6 col-md-8">
                        <a href="#" class="thumbnail"
                           th:href="@{'/book/enterBookMessage?requestBook='+${session.HOTBOOK_LIST.get(2).getId()}}">
                            <img src="../../static/picture/hot1.jpg"
                                 th:src="@{'/picture/book/'+${session.HOTBOOK_LIST.get(2).getPicture()}}">
                        </a>
                    </div>

                </div>

            </div>
            <div class="col-sm-6 col-md-3">
                <div>
                    <a href="#"  class="list-group-item"
                       th:href="@{'/book/enterBookMessage?requestBook='+${session.HOTBOOK_LIST.get(3).getId()}}">
                        <div th:text="${session.HOTBOOK_LIST.get(3).getBookname()}">1</div>
                    </a>
                    <a href="#" class="list-group-item"
                       th:href="@{'/book/enterBookMessage?requestBook='+${session.HOTBOOK_LIST.get(4).getId()}}">
                        <div th:text="${session.HOTBOOK_LIST.get(4).getBookname()}">1</div>
                    </a>
                    <a href="#" class="list-group-item"
                       th:href="@{'/book/enterBookMessage?requestBook='+${session.HOTBOOK_LIST.get(5).getId()}}">
                        <div th:text="${session.HOTBOOK_LIST.get(5).getBookname()}">1</div>
                    </a>
                    <a href="#" class="list-group-item"
                       th:href="@{'/book/enterBookMessage?requestBook='+${session.HOTBOOK_LIST.get(6).getId()}}">
                        <div th:text="${session.HOTBOOK_LIST.get(6).getBookname()}">1</div>
                    </a>
                    <a href="#" class="list-group-item"
                       th:href="@{'/book/enterBookMessage?requestBook='+${session.HOTBOOK_LIST.get(7).getId()}}">
                        <div th:text="${session.HOTBOOK_LIST.get(7).getBookname()}">1</div>
                    </a>
                    <a href="#" class="list-group-item"
                       th:href="@{'/book/enterBookMessage?requestBook='+${session.HOTBOOK_LIST.get(8).getId()}}">
                        <div th:text="${session.HOTBOOK_LIST.get(8).getBookname()}">1</div>
                    </a>
                    <a href="#" class="list-group-item"
                       th:href="@{'/book/enterBookMessage?requestBook='+${session.HOTBOOK_LIST.get(9).getId()}}">
                        <div th:text="${session.HOTBOOK_LIST.get(9).getBookname()}">1</div>
                    </a>
                    <a href="#" class="list-group-item" th:href="@{'/book/enterBookList?requestPage=热销'}">更多>></a>
                </div>

            </div>
        </div>
    </div>

    <!--新书上市-->
    <section class="cta"
             th:style="'background: linear-gradient(rgba(66, 84, 81, 0.5), rgba(43, 56, 54, 0.5)), url(/picture/new.jpg) fixed center center'">
        <div class="container">

            <div class="text-center">
                <h3>新书上市</h3>
                <p></p>
                <a class="cta-btn" href="#" th:href="@{'/book/enterBookList?requestPage=新品'}">查看更多</a>
            </div>

        </div>
    </section>

    <!--新书缩略图-->
    <section class="more-services section-bg">
        <div class="container">

            <div class="row">
                <div class="col-lg-4 col-md-1 d-flex align-items-stretch mb-5 mb-lg-0">
                    <div class="card">
                        <div class="col-sm-12 col-md-12">
                            <a class="thumbnail"
                               th:href="@{'/book/enterBookMessage?requestBook='+${session.NEWBOOK_LIST.get(0).getId()}}">
                                <img src="../../static/picture/new1.jpg" class="card-img-top" alt="..."
                                     th:src="@{'/picture/book/'+${session.NEWBOOK_LIST.get(0).getPicture()}}">
                            </a>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">
                                <a href="" th:text="${session.NEWBOOK_LIST.get(0).getBookname()}">1</a>
                            </h5>
                            <p class="card-text" th:text="${session.NEWBOOK_LIST.get(0).getAuthor()}">1</p>
                            <a href="#" class="btn"
                               th:href="@{'/book/enterBookMessage?requestBook='+${session.NEWBOOK_LIST.get(0).getId()}}">查看详情</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-1 d-flex align-items-stretch mb-5 mb-lg-0">
                    <div class="card">
                        <div class="col-sm-12 col-md-12">
                            <a class="thumbnail"
                               th:href="@{'/book/enterBookMessage?requestBook='+${session.NEWBOOK_LIST.get(1).getId()}}">
                                <img src="../../static/picture/new2.jpg" class="card-img-top" alt="..."
                                     th:src="@{'/picture/book/'+${session.NEWBOOK_LIST.get(1).getPicture()}}">
                            </a>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title"><a href="" th:text="${session.NEWBOOK_LIST.get(1).getBookname()}">1</a></h5>
                            <p class="card-text" th:text="${session.NEWBOOK_LIST.get(1).getAuthor()}">1</p>
                            <a href="#" class="btn"
                               th:href="@{'/book/enterBookMessage?requestBook='+${session.NEWBOOK_LIST.get(1).getId()}}">查看详情</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-1 d-flex align-items-stretch mb-5 mb-lg-0">
                    <div class="card">
                        <div class="col-sm-12 col-md-12">
                            <a class="thumbnail"
                               th:href="@{'/book/enterBookMessage?requestBook='+${session.NEWBOOK_LIST.get(2).getId()}}">
                                <img src="../../static/picture/new3.jpg" class="card-img-top" alt="..."
                                     th:src="@{'/picture/book/'+${session.NEWBOOK_LIST.get(2).getPicture()}}">
                            </a>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title"><a href="" th:text="${session.NEWBOOK_LIST.get(2).getBookname()}">1</a></h5>
                            <p class="card-text" th:text="${session.NEWBOOK_LIST.get(2).getAuthor()}">1</p>
                            <a href="#" class="btn"
                               th:href="@{'/book/enterBookMessage?requestBook='+${session.NEWBOOK_LIST.get(2).getId()}}">查看更多</a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>

    <div th:if="${session.USER_INFO}">
        <!--为您推荐-->
        <section class="cta"
                 th:style="'background: linear-gradient(rgba(66, 84, 81, 0.5), rgba(43, 56, 54, 0.5)), url(/picture/hot.jpg) fixed center center'">
            <div class="container">

                <div class="text-center">
                    <h3>为您推荐</h3>
                    <p></p>
                    <!--                <a class="cta-btn" href="#" th:href="@{'/book/enterBookList?requestPage=新品'}">查看更多</a>-->
                </div>

            </div>
        </section>

        <!--推荐书籍缩略图-->
        <section class="more-services section-bg">
            <div class="container">

                <div class="row">
                    <div class="col-lg-4 col-md-1 d-flex align-items-stretch mb-5 mb-lg-0">
                        <div class="card">
                            <div class="col-sm-12 col-md-12">
                                <a class="thumbnail"
                                   th:href="@{'/book/enterBookMessage?requestBook='+${session.RECOMMENDBOOK_LIST.get(0).getId()}}">
                                    <img src="../../static/picture/new1.jpg" class="card-img-top" alt="..."
                                         th:src="@{'/picture/book/'+${session.RECOMMENDBOOK_LIST.get(0).getPicture()}}">
                                </a>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">
                                    <a href="" th:text="${session.RECOMMENDBOOK_LIST.get(0).getBookname()}">1</a>
                                </h5>
                                <p class="card-text" th:text="${session.RECOMMENDBOOK_LIST.get(0).getAuthor()}">1</p>
                                <a href="#" class="btn"
                                   th:href="@{'/book/enterBookMessage?requestBook='+${session.RECOMMENDBOOK_LIST.get(0).getId()}}">查看详情</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-1 d-flex align-items-stretch mb-5 mb-lg-0">
                        <div class="card">
                            <div class="col-sm-12 col-md-12">
                                <a class="thumbnail"
                                   th:href="@{'/book/enterBookMessage?requestBook='+${session.RECOMMENDBOOK_LIST.get(1).getId()}}">
                                    <img src="../../static/picture/new2.jpg" class="card-img-top" alt="..."
                                         th:src="@{'/picture/book/'+${session.RECOMMENDBOOK_LIST.get(1).getPicture()}}">
                                </a>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title"><a href="" th:text="${session.RECOMMENDBOOK_LIST.get(1).getBookname()}">1</a></h5>
                                <p class="card-text" th:text="${session.RECOMMENDBOOK_LIST.get(1).getAuthor()}">1</p>
                                <a href="#" class="btn"
                                   th:href="@{'/book/enterBookMessage?requestBook='+${session.RECOMMENDBOOK_LIST.get(1).getId()}}">查看详情</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-1 d-flex align-items-stretch mb-5 mb-lg-0">
                        <div class="card">
                            <div class="col-sm-12 col-md-12">
                                <a class="thumbnail"
                                   th:href="@{'/book/enterBookMessage?requestBook='+${session.RECOMMENDBOOK_LIST.get(2).getId()}}">
                                    <img src="../../static/picture/new3.jpg" class="card-img-top" alt="..."
                                         th:src="@{'/picture/book/'+${session.RECOMMENDBOOK_LIST.get(2).getPicture()}}">
                                </a>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title"><a href="" th:text="${session.RECOMMENDBOOK_LIST.get(2).getBookname()}">1</a></h5>
                                <p class="card-text" th:text="${session.RECOMMENDBOOK_LIST.get(2).getAuthor()}">1</p>
                                <a href="#" class="btn"
                                   th:href="@{'/book/enterBookMessage?requestBook='+${session.RECOMMENDBOOK_LIST.get(2).getId()}}">查看更多</a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    </div>

    <!-- 页尾 -->
    <footer id="footer" th:fragment="footerIndex">
        <div class="footer-top">
            <div class="container">
                <div class="row">

                    <div class="col-lg-3 col-md-6 footer-info">
                        <h3>黑大帅书城</h3>
                        <p>
                            江苏镇江<br>
                            江苏大学<br><br>
                            <strong>电话</strong> 18664966453<br>
                            <strong>邮件</strong> 2382314021@qq.com<br>
                        </p>

                    </div>

                    <div class="col-lg-2 col-md-6 footer-links">
                        <h4>相关链接</h4>
                        <ul>
                            <li><i class="bx bx-chevron-right"></i> <a href="#">主页</a></li>
                            <li><i class="bx bx-chevron-right"></i> <a href="#">关于我们</a></li>
                            <li><i class="bx bx-chevron-right"></i> <a href="#">服务</a></li>
                            <li><i class="bx bx-chevron-right"></i> <a href="#">隐私政策</a></li>
                            <li><i class="bx bx-chevron-right"></i> <a href="#">已经不知道写什么了</a></li>
                        </ul>
                    </div>

                    <div class="col-lg-3 col-md-6 footer-links">
                        <h4>好耶</h4>
                        <ul>
                            <li><i class="bx bx-chevron-right"></i> <a href="#">新品</a></li>
                            <li><i class="bx bx-chevron-right"></i> <a href="#">热销</a></li>
                            <li><i class="bx bx-chevron-right"></i> <a href="#">购物车</a></li>
                            <li><i class="bx bx-chevron-right"></i> <a href="#">订单信息</a></li>
                            <li><i class="bx bx-chevron-right"></i> <a href="#">个人中心</a></li>
                        </ul>
                    </div>

                    <div class="col-lg-4 col-md-6 footer-newsletter">
                        <h4>联系我</h4>
                        <p>哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</p>
                        <form action="" method="post">
                            <input type="email" name="email"><input type="submit" value="提交">
                        </form>

                    </div>

                </div>
            </div>
        </div>

        <div class="container">
            <div class="copyright">
                &copy; Copyright <strong><span>黑大帅书城</span></strong>. All Rights Reserved
            </div>
            <div class="credits">
                Designed by <a href="#">黑大帅</a>
            </div>
        </div>
    </footer>

</div>

</body>
</html>
```

##### bookList.html

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>新品书籍</title>
    <link rel="stylesheet" href="../../static/css/bootstrap.css" th:href="@{/css/bootstrap.css}">
    <link rel="stylesheet" href="../../static/css/bookList.css" th:href="@{/css/newBook.css}">
    <link rel="stylesheet" href="../../static/css/public.css" th:href="@{/css/public.css}">
    <script src="../../static/js/jquery.js" th:src="@{/js/jquery.js}"></script>
    <script src="../../static/js/bootstrap.js" th:src="@{/js/bootstrap.js}"></script>
</head>
<body>
<!--引入公共导航栏-->
<div th:replace="index/index::navbarIndex"></div>

<div class="container">
    <div class="row">
        <div class="col-xs-6 col-md-6 col-md-offset-3">
            <div class="newBookTable">
                <!--表格-->
                <div th:if="${list.size()}">
                    <table class="table table-hover">
                        <tr>
                            <td>书名</td>
                            <td>作者</td>
                            <td>类别</td>
                            <td>价格</td>
                            <td>销售量</td>
                            <td>上架时间</td>
                        </tr>
                        <tr th:each="book:${list}">
                            <td ><a th:href="@{'/book/enterBookMessage?requestBook='+${book.getId()}}"
                                    th:text="${book.getBookname()}">1</a></td>
                            <td th:text="${book.getAuthor()}">1</td>
                            <td th:text="${book.getCategory()}">1</td>
                            <td th:text="${book.getPrice()}">1</td>
                            <td th:text="${book.getSoldoutnumber()}">1</td>
                            <td th:text="${book.getTime()}">1</td>
                        </tr>
                    </table>
                </div>
                <!--分页按钮-->
                <div class="col-md-offset-3 col-lg-offset-4col-xl-offset-4">
                    <nav aria-label="Page navigation">
                        <ul class="pagination">
                            <li>
                                <a href="#" aria-label="Previous"
                                   th:href="@{'/book/enterBookList?requestPage='+${str}+'?pageNo=1'}">
                                    <span aria-hidden="true">首页</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" aria-label="Previous"
                                   th:href="@{'/book/enterBookList?requestPage='+${str}+'?pageNo='+${pagePrev}}">
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>
                            <li th:each="i:${#numbers.sequence(1,pageCount)}">
                                <a href="#" th:href="@{'/book/enterBookList?requestPage='+${str}+'?pageNo='+${i}}" th:text="${i}"
                                >1</a></li>

                            <li>
                                <a href="#" aria-label="Next"
                                   th:href="@{'/book/enterBookList?requestPage='+${str}+'?pageNo='+${pageNext}}">
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" aria-label="Next"
                                   th:href="@{'/book/enterBookList?requestPage='+${str}+'?pageNo='+${pageCount}}">
                                    <span aria-hidden="true">尾页</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>

</div>

<!--引入公共页尾-->
<div th:replace="index/index::footerIndex"></div>


</body>
</html>
```

##### bookMessage.html

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title th:text="${bookMessage.getBookname()}+'-详情页'">Title</title>
    <link rel="stylesheet" href="../../static/css/bootstrap.css" th:href="@{/css/bootstrap.css}">
    <link rel="stylesheet" href="../../static/css/public.css" th:href="@{/css/public.css}">
    <script src="../../static/js/jquery.js" th:src="@{/js/jquery.js}"></script>
    <script src="../../static/js/bootstrap.js" th:src="@{/js/bootstrap.js}"></script>
</head>
<body>
<!--引入公共导航栏-->
<div th:replace="index/index::navbarIndex"></div>
<div class="container">
    <div class="row">
        <div class="col-xs-6 col-md-6 col-md-offset-3">
            <div>
                <div>
                    <table class="table table-hover">
                        <tr>
                            <div class="thumbnail">
                                <img src="../../static/picture/book/bainiangudu.jpg"
                                     th:src="@{'/picture/book/'+${bookMessage.getPicture()}}" width="400" height="400">
                            </div>

                        </tr>
                        <tr>
                            <td><div>书名<p th:text="${bookMessage.getBookname()}">1</p></div></td>
                            <td><div>作者<p th:text="${bookMessage.getAuthor()}">1</p></div></td>
                            <td><div>编号<p th:text="${bookMessage.getBooknumber()}">1</p></div></td>
                            <td><div>类别<p th:text="${bookMessage.getCategory()}">1</p></div></td>
                        </tr>
                        <tr>
                            <td><div>价格<p th:text="${bookMessage.getPrice()}">1</p></div></td>
                            <td><div>数量<p th:text="${bookMessage.getBooknumber()}">1</p></div></td>
                            <td><div>售出数量<p th:text="${bookMessage.getSoldoutnumber()}">1</p></div></td>
                            <td><div>上架时间<p th:text="${bookMessage.getTime()}">1</p></div></td>
                        </tr>
                        <tr>
                            <div>介绍<p th:text="${bookMessage.getDescription()}">1</p></div>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-6 col-md-6 col-md-offset-3" style="margin-bottom: 50px">
            <div>
                <form action="/order/createOrder" method="post" th:method="post">
                    <input type="text" name="purchaseNumber" placeholder="需要购买的数量">
                    <input type="text" name="note" placeholder="备注">
                    <input type="submit" value="购买">
                    <input type="submit" formaction="/trolley/addToTrolley"
                           value="添加至购物车">
                </form>
            </div>
        </div>
    </div>

</div>

<!--引入公共页尾-->
<div th:replace="index/index::footerIndex"></div>

</body>
</html>
```

#### user

##### login.html

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>用户登录</title>
    <link rel="stylesheet" th:href="@{/css/login.css}">
</head>
<body>
<div class="loginDiv">
    <form action="/user/login" method="post">
        <h1>欢迎回来</h1>
        <div>
            <input type="text" name="username" placeholder="用户名">
            <input type="password" name="password" placeholder="密码">
            <input type="submit" value="登录">
            <input type="button" value="注册" onclick="window.open('/user/enterRegister')">
        </div>
    </form>
</div>
</body>
</html>
```

##### register.html

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>用户注册</title>
    <link rel="stylesheet" href="../../static/css/register.css" th:href="@{/css/register.css}">
    <script src="../../static/js/register.js" th:src="@{/js/register.js}"></script>
</head>
<body>
<div class="registerDiv">
    <form action="/user/register" method="post">
        <h1>加入我们</h1>
        <div>
            <input type="text" name="username" id="username" placeholder="用户名"
                   required pattern=".{3,16}">
            <span class="poptip">仅支持字母、数字和下划线组合！!</span>
            <input type="password" name="password" placeholder="密码" required>
            <input type="password" name="confirmPassword" placeholder="确认密码" required>
            <input type="email" name="email" placeholder="邮箱" required><br>
            <!--            <input type="tel" placeholder="手机号码">-->
            <input type="text" name="verifyCode" id="displayKaptcha" placeholder="验证码" required>
            <span class="verifyCodeFrom">
                <img class="verifyCodeImg" alt="验证码" onclick="this.src='defaultKaptcha?d='+new Date()*1"
                     src="defaultKaptcha">
            </span>
            <input type="submit" value="注册">
            <input type="button" value="登录" onclick="window.open('/user/enterLogin')">
        </div>
    </form>
</div>

</body>
</html>
```

##### emailCode.html

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>邮箱验证码</title>
    <link rel="stylesheet" href="../../static/css/login.css" th:href="@{/css/login.css}">
</head>
<body>
<form class="emailCodeDiv" action="/user/addUser">
    <div >
        <input type="text" name="inputEmailCode" placeholder="邮箱验证码">
        <input type="submit" value="提交">
    </div>
</form>
</body>
</html>
```

##### userCenter.html

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>用户中心</title>
    <link rel="stylesheet" href="../../static/css/bootstrap.css" th:href="@{/css/bootstrap.css}">
    <link rel="stylesheet" href="../../static/css/public.css" th:href="@{/css/public.css}">
    <script src="../../static/js/jquery.js" th:src="@{/js/jquery.js}"></script>
    <script src="../../static/js/bootstrap.js" th:src="@{/js/bootstrap.js}"></script>
</head>
<body>

<!--引入公共导航栏-->
<div th:replace="index/index::navbarIndex"></div>
<div class="container">
    <div class="row">
        <div class="col-xs-6 col-md-6 col-md-offset-3">
            <div>
                <div>
                    <table class="table table-hover">
                        <tr>
                            <td><div>用户名<p th:text="${session.USER_INFO.getUsername()}">1</p></div></td>
                            <td><div>邮箱<p th:text="${session.USER_INFO.getEmail()}">1</p></div></td>
                        </tr>
                        <tr>
                            <td><div>联系方式<p th:text="${session.USER_INFO.getPhone()}">1</p></div></td>
                            <td><div>联系地址<p th:text="${session.USER_INFO.getAddress()}">1</p></div></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-md-offset-5" style="margin-bottom: 50px">
            <div>
                <form action="/user/enterAlterUser" method="post" th:method="post">
                    <input class="btn btn-default" type="submit" value="修改账号">
                </form>
                <form action="/user/alterUserAvatar" method="post" enctype="multipart/form-data">
                    <input type="file" name="file" id="file">
                    <div th:if="${session.USER_INFO.getAvatar()}">
                        <img th:src="@{'/picture/'+${session.USER_INFO.getAvatar()}}" id="img" alt="..." width="50px" height="50px">
                    </div>
                    <input class="btn btn-default" type="submit" value="修改头像">
                </form>
            </div>
        </div>
    </div>

</div>

<!--引入公共页尾-->
<div th:replace="index/index::footerIndex"></div>
</body>
</html>
```

##### alter.html

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>修改个人信息</title>
    <link rel="stylesheet" href="../../static/css/login.css" th:href="@{/css/login.css}">
</head>
<body>
<div class="alterDiv">
    <form action="/user/alterUserData" method="post">
        <h1>修改信息</h1>
        <h4 th:text="'用户名：'+${session.USER_INFO.getUsername()}">用户名</h4>
<!--        <h4>VIP等级</h4>-->
        <div>
            <input type="password" name="password" placeholder="密码">
            <input type="text" name="email" placeholder="邮箱" th:value="${session.USER_INFO.getEmail()}">
            <input type="text" name="phone" placeholder="电话" th:value="${session.USER_INFO.getPhone()}">
            <input type="text" name="address" placeholder="地址" th:value="${session.USER_INFO.getAddress()}">
<!--            <br>-->
<!--            <img th:src="@{'/picture/'+${session.USER_INFO.getAvatar()}}"-->
<!--                 width="40" height="40" alt="avatar">-->
<!--            <input type="file" name="avatar" placeholder="头像">-->
<!--            <input type="text" name="avatar" placeholder="头像">-->
            <input type="submit" value="提交">
            <input type="button" value="返回" onclick="window.open('/')">
        </div>
    </form>
</div>
</body>
</html>
```

#### purchase

##### trolley.html

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>购物车</title>
    <link rel="stylesheet" href="../../static/css/bootstrap.css" th:href="@{/css/bootstrap.css}">
    <link rel="stylesheet" href="../../static/css/bookList.css" th:href="@{/css/newBook.css}">
    <link rel="stylesheet" href="../../static/css/public.css" th:href="@{/css/public.css}">
    <script src="../../static/js/jquery.js" th:src="@{/js/jquery.js}"></script>
    <script src="../../static/js/bootstrap.js" th:src="@{/js/bootstrap.js}"></script>
</head>
<body>
<!--引入公共导航栏-->
<div th:replace="index/index::navbarIndex"></div>

<div class="container">
    <div class="row">
        <div class="col-xs-6 col-md-6 col-md-offset-3">
            <div class="newBookTable">
                <!--表格-->
                <div>
                    <table class="table table-hover">
                        <tr th:each="trolley : ${list}">
                            <td th:text="${trolley.getBookname()}">1</td>
                            <td th:text="${trolley.getAuthor()}">1</td>
                            <td th:text="${trolley.getPrice()}">1</td>
                            <td th:text="${trolley.getPurchasenumber()}">1</td>
                            <td th:text="${trolley.getNote()}">1</td>
                            <td>
                                <a th:href="@{'/order/createOrder?trolleyData='+${trolley.getId()}+','+${trolley.getPurchasenumber()}+','+${trolley.getNote()}}">
                                    <button class="btn btn-default">购买</button>
                                </a>
                            </td>
                        </tr>
                    </table>
                </div>
                <!--分页按钮-->
                <div class="col-md-offset-4 col-lg-offset-4col-xl-offset-4">
                    <nav aria-label="Page navigation">
                        <ul class="pagination">
                            <li>
                                <a href="#" aria-label="Previous"
                                   th:href="@{'/trolley/enterTrolleyList?pageNo=1'}">
                                    <span aria-hidden="true">首页</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" aria-label="Previous"
                                   th:href="@{'/trolley/enterTrolleyList?pageNo='+${pagePrev}}">
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>
                            <li th:each="i:${#numbers.sequence(1,pageCount)}">
                                <a href="#" th:href="@{'/trolley/enterTrolleyList?pageNo='+${i}}" th:text="${i}"
                                >1</a></li>

                            <li>
                                <a href="#" aria-label="Next"
                                   th:href="@{'/trolley/enterTrolleyList?pageNo='+${pageNext}}">
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" aria-label="Next"
                                   th:href="@{'/trolley/enterTrolleyList?pageNo='+${pageCount}}">
                                    <span aria-hidden="true">尾页</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</div>

<!--引入公共页尾-->
<div th:replace="index/index::footerIndex"></div>

</body>
</html>
```

##### order.html

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>订单</title>
    <link rel="stylesheet" href="../../static/css/bootstrap.css" th:href="@{/css/bootstrap.css}">
    <link rel="stylesheet" href="../../static/css/bookList.css" th:href="@{/css/newBook.css}">
    <link rel="stylesheet" href="../../static/css/public.css" th:href="@{/css/public.css}">
    <script src="../../static/js/jquery.js" th:src="@{/js/jquery.js}"></script>
    <script src="../../static/js/bootstrap.js" th:src="@{/js/bootstrap.js}"></script>
</head>
<body>
<!--引入公共导航栏-->
<div th:replace="index/index::navbarIndex"></div>

<div class="container">
    <div class="row">
        <div class="col-xs-6 col-md-6 col-md-offset-3">
            <div class="newBookTable">
                <!--表格-->
                <div>
                    <table class="table table-hover">
                        <tr th:each="order : ${list}">
                            <td th:text="${order.getBookname()}">1</td>
                            <td th:text="${order.getAuthor()}">1</td>
                            <td th:text="${order.getPrice()}">1</td>
                            <td th:text="${order.getPurchasenumber()}">1</td>
                            <td th:text="${order.getNote()}">1</td>
                        </tr>
                    </table>
                </div>
                <!--分页按钮-->
                <div class="col-md-offset-4 col-lg-offset-4col-xl-offset-4">
                    <nav aria-label="Page navigation">
                        <ul class="pagination">
                            <li>
                                <a href="#" aria-label="Previous"
                                   th:href="@{'/order/enterOrderList?pageNo=1'}">
                                    <span aria-hidden="true">首页</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" aria-label="Previous"
                                   th:href="@{'/order/enterOrderList?pageNo='+${pagePrev}}">
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>
                            <li th:each="i:${#numbers.sequence(1,pageCount)}">
                                <a href="#" th:href="@{'/order/enterOrderList?pageNo='+${i}}" th:text="${i}"
                                >1</a></li>

                            <li>
                                <a href="#" aria-label="Next"
                                   th:href="@{'/order/enterOrderList?pageNo='+${pageNext}}">
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" aria-label="Next"
                                   th:href="@{'/order/enterOrderList?pageNo='+${pageCount}}">
                                    <span aria-hidden="true">尾页</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</div>

<!--引入公共页尾-->
<div th:replace="index/index::footerIndex"></div>

</body>
</html>
```

##### orderMessage.html

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>订单详情页</title>
    <link rel="stylesheet" href="../../static/css/bootstrap.css" th:href="@{/css/bootstrap.css}">
    <link rel="stylesheet" href="../../static/css/public.css" th:href="@{/css/public.css}">
    <script src="../../static/js/jquery.js" th:src="@{/js/jquery.js}"></script>
    <script src="../../static/js/bootstrap.js" th:src="@{/js/bootstrap.js}"></script>
</head>
<body>
<!--引入公共导航栏-->
<div th:replace="index/index::navbarIndex"></div>
<div class="container">
    <div class="row">
        <div class="col-xs-6 col-md-6 col-md-offset-3">
            <div>
                <div>
                    <table class="table table-hover">
                        <tr>
                            <td><div>书名<p th:text="${session.ORDER_MESSAGE.getBookname()}">1</p></div></td>
                            <td><div>作者<p th:text="${session.ORDER_MESSAGE.getAuthor()}">1</p></div></td>
                            <td><div>编号<p th:text="${session.ORDER_MESSAGE.getBooknumber()}">1</p></div></td>
                            <td><div>价格<p th:text="${session.ORDER_MESSAGE.getPrice()}">1</p></div></td>
                        </tr>
                        <tr>
                            <td><div>购买数量<p th:text="${session.ORDER_MESSAGE.getPurchasenumber()}">1</p></div></td>
                            <td><div>联系方式<p th:text="${session.ORDER_MESSAGE.getPhone()}">1</p></div></td>
                            <td><div>联系地址<p th:text="${session.ORDER_MESSAGE.getAddress()}">1</p></div></td>
                            <td>
                                <div>总计价格
                                    <p th:text="${session.ORDER_MESSAGE.getPurchasenumber()*session.ORDER_MESSAGE.getPrice()}">1</p>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2 col-md-offset-5" style="margin-bottom: 50px">
            <div>
                <form action="/alipay/goAlipay" method="post" th:method="post">
                    <input class="btn btn-default" type="submit" value="支付宝支付">
                </form>
            </div>
        </div>
    </div>

</div>

<!--引入公共页尾-->
<div th:replace="index/index::footerIndex"></div>

</body>
</html>
```

#### css

##### public.css

```css
/*--------------------------------------------------------------
# 背景
--------------------------------------------------------------*/
body{
    background: linear-gradient(-45deg, #ff2a2a, #b6e5f8);
    animation: gradientBG 8s ease infinite;
    background-size: 400% 400%;
}
@keyframes gradientBG{
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
/*--------------------------------------------------------------
# 导航栏相关
--------------------------------------------------------------*/
.dropdown:hover .dropdown-menu {
    display: block;
}
/*--------------------------------------------------------------
# 页尾部分
--------------------------------------------------------------*/
#footer {
    background: black;
    padding: 0 0 30px 0;
    color: #fff;
    font-size: 14px;
}
#footer .footer-top {
    background: black;
    border-bottom: 1px solid #4d635f;
    padding: 60px 0 30px 0;
}
#footer .footer-top .footer-info {
    margin-bottom: 30px;
}
#footer .footer-top .footer-info h3 {
    font-size: 24px;
    margin: 0 0 20px 0;
    padding: 2px 0 2px 0;
    line-height: 1;
    font-weight: 700;
}
#footer .footer-top .footer-info p {
    font-size: 14px;
    line-height: 24px;
    margin-bottom: 0;
    font-family: "Roboto", sans-serif;
    color: #fff;
}
#footer .footer-top .social-links a {
    font-size: 18px;
    display: inline-block;
    background: #58716d;
    color: #fff;
    line-height: 1;
    padding: 8px 0;
    margin-right: 4px;
    border-radius: 50%;
    text-align: center;
    width: 36px;
    height: 36px;
    transition: 0.3s;
}
#footer .footer-top .social-links a:hover {
    background: #1bbca3;
    color: #fff;
    text-decoration: none;
}
#footer .footer-top h4 {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    position: relative;
    padding-bottom: 12px;
}
#footer .footer-top .footer-links {
    margin-bottom: 30px;
}
#footer .footer-top .footer-links ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
#footer .footer-top .footer-links ul i {
    padding-right: 2px;
    color: #56e7d0;
    font-size: 18px;
    line-height: 1;
}
#footer .footer-top .footer-links ul li {
    padding: 10px 0;
    display: flex;
    align-items: center;
}
#footer .footer-top .footer-links ul li:first-child {
    padding-top: 0;
}
#footer .footer-top .footer-links ul a {
    color: #fff;
    transition: 0.3s;
    display: inline-block;
    line-height: 1;
}
#footer .footer-top .footer-links ul a:hover {
    color: #40e4ca;
}
#footer .footer-top .footer-newsletter form {
    margin-top: 30px;
    background: #fff;
    padding: 6px 10px;
    position: relative;
    border-radius: 4px;
}
#footer .footer-top .footer-newsletter form input[type=email] {
    border: 0;
    padding: 4px;
    width: calc(100% - 110px);
}
#footer .footer-top .footer-newsletter form input[type=submit] {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    border: 0;
    background: none;
    font-size: 16px;
    padding: 0 20px;
    background: #1bbca3;
    color: #fff;
    transition: 0.3s;
    border-radius: 4px;
}
#footer .footer-top .footer-newsletter form input[type=submit]:hover {
    background: #158f7c;
}
#footer .copyright {
    text-align: center;
    padding-top: 30px;
}
#footer .credits {
    padding-top: 10px;
    text-align: center;
    font-size: 13px;
    color: #fff;
}
```

##### index.css

```css
.customizeCarouselLocation{
    margin-left: 30%;
    width: 40%;
}
.customizeHotProduct{
    background-color: white;
    border-radius: 16px;
    margin: 50px 200px;
    padding: 10px;
}
.customizeHotProduct-Part{
    margin: 0 10px;
}
.customizeHotProduct-picture{
    margin-top: 10px;
}
.customizeNewProduct{
    margin: 10px 200px 10px 250px;
    padding-top: 10px;
    /*border-top:2px solid black;*/
    /*border-bottom:2px solid black;*/
}
.customizeNewProduct-caption{
    margin-top: 50px;
    border: none;
}
/*--------------------------------------------------------------
# cta
--------------------------------------------------------------*/
.cta {
    background: linear-gradient(rgba(66, 84, 81, 0.5), rgba(43, 56, 54, 0.5)), url("../../static/picture/new.jpg") fixed center center;
    background-size: cover;
    padding: 60px 0;
}
.cta h3 {
    color: #fff;
    font-size: 28px;
    font-weight: 700;
}
.cta p {
    color: #fff;
}
.cta .cta-btn {
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    font-size: 16px;
    letter-spacing: 1px;
    display: inline-block;
    padding: 8px 28px;
    border-radius: 25px;
    transition: 0.5s;
    margin-top: 10px;
    border: 2px solid #1bbca3;
    color: #fff;
}
.cta .cta-btn:hover {
    background: #1bbca3;
    border: 2px solid #1bbca3;
}
.more-services{
    margin: 30px 0;
}
.more-services img {
    border-radius: 0;
}
.more-services .card {
    border: 0;
    text-align: center;
}
.more-services .card-body {
    -moz-text-align-last: center;
    text-align-last: center;
}
.more-services .card-title a {
    font-weight: 600;
    font-size: 18px;
    color: #334240;
    transition: ease-in-out 0.3s;
}
.more-services .card-title a:hover {
    color: #1bbca3;
}
.more-services .btn {
    border-radius: 50px;
    padding: 4px 30px 6px 30px;
    border: 2px solid #1bbca3;
}
.more-services .btn:hover {
    color: #fff;
    background: #1bbca3;
}
```

##### login.css

```css
body{
    text-align: center;
    background: linear-gradient(-45deg, #ff2a2a, #b6e5f8);
    animation: gradientBG 8s ease infinite;
    background-size: 400% 400%;
}
@keyframes gradientBG{
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
.loginDiv{
    top:10%;
    width: 30%;
    height: 65%;
    border: 1px solid black;
    position: absolute;
    background-color: #FCFBFA;
    left: 35%;
    border-radius: 8px;
}
/*邮箱页面*/
.emailCodeDiv{
    top:30%;
    width: 30%;
    padding-top: 50px;
    height: 180px;
    border: 1px solid black;
    position: absolute;
    background-color: #FCFBFA;
    left: 35%;
    border-radius: 8px;
}
/*修改用户信息页面*/
.alterDiv{
    top:5%;
    width: 30%;
    height: 750px;
    border: 1px solid black;
    position: absolute;
    background-color: #FCFBFA;
    left: 35%;
    border-radius: 8px;
}
h1{
    font-size: 40px;
    margin-bottom: 50px;
}
form{
    margin: 10px;
}
input{
    background-color: white;
    width: 50%;
    height: 48px;
    border-radius: 24px;
    margin-bottom: 30px;
    padding: 0 16px;
    font-size: 18px;
    text-align: center;
    color: #c4c3ca;
    font-weight: 500;
    outline: none;
    border: 2px solid black;
    box-shadow: 0 4px 8px 0 rgba(78, 73, 79, .5);
    transition: 0.25s;
}
input:focus{
    border-color: #3498db;
    border-radius: 8px;
}
input[type = "submit"],input[type = "button"]{
    background: black;
    margin-left: 25%;
    display: block;
    border: 1px solid white;
    color: white;
    transition: 0.25s;
    cursor: pointer;
}
input[type = "submit"]:hover,input[type = "button"]:hover{
    border-color: #3498db;
    font-size: 22px;
    border-radius: 8px;
}
/*.inputDiv input[type = "submit"]:focus,.inputDiv input[type = "button"]:focus{*/
/*    color: black;*/
/*    background-color: white;*/
/*}*/

@media screen and (max-width: 800px){
    .loginDiv{
        top:10%;
        width: 30%;
        height: 65%;
        border: 1px solid black;
        position: absolute;
        background-color: #FCFBFA;
        left: 35%;
        border-radius: 8px;
    }
    h1{
        font-size: 40px;
        margin-bottom: 50px;
    }
    form{
        margin: 10px;
    }
    input{
        background-color: white;
        width: 50%;
        height: 48px;
        border-radius: 24px;
        margin-bottom: 30px;
        padding: 0 16px;
        font-size: 18px;
        text-align: center;
        color: #c4c3ca;
        font-weight: 500;
        outline: none;
        border: 2px solid black;
        box-shadow: 0 4px 8px 0 rgba(78, 73, 79, .5);
        transition: 0.25s;
    }
    input:focus{
        border-color: #3498db;
        border-radius: 8px;
    }
    input[type = "submit"],input[type = "button"]{
        background: black;
        margin-left: 25%;
        display: block;
        border: 1px solid white;
        color: white;
        transition: 0.25s;
        cursor: pointer;
    }
    input[type = "submit"]:hover,input[type = "button"]:hover{
        border-color: #3498db;
        font-size: 22px;
        border-radius: 8px;
    }
}
```

##### register.css

```css
body{
    text-align: center;
    background: linear-gradient(-45deg, #ff2a2a, #b6e5f8);
    animation: gradientBG 8s ease infinite;
    background-size: 400% 400%;
}
@keyframes gradientBG{
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
.registerDiv{
    top:7%;
    width: 30%;
    height: 86%;
    border: 1px solid black;
    position: absolute;
    background-color: #FCFBFA;
    left: 35%;
    border-radius: 8px;
}
h1{
    font-size: 40px;
    margin-bottom: 20px;
}
form{
    margin: 10px;
}
input{
    background-color: white;
    width: 50%;
    height: 48px;
    border-radius: 24px;
    margin-bottom: 20px;
    padding: 0 16px;
    font-size: 18px;
    text-align: center;
    color: #c4c3ca;
    font-weight: 500;
    outline: none;
    border: 2px solid black;
    box-shadow: 0 4px 8px 0 rgba(78, 73, 79, .5);
    transition: 0.25s;
}
input:focus{
    border-radius: 8px;
    border-color: #3498db;
}
.checkCode{
    width: 25%;
}
input[type = "submit"],input[type = "button"]{
    background: black;
    margin-left: 25%;
    display: block;
    border: 1px solid white;
    color: white;
    transition: 0.25s;
    cursor: pointer;
}
input[type = "submit"]:hover{
    border-color: #3498db;
    font-size: 22px;
    border-radius: 8px;
}
input[type = "button"]:focus{
    color: black;
    background-color: white;
}
input[type = "button"]:hover{
    border-color: #3498db;
    font-size: 22px;
    border-radius: 8px;
}
input[type = "submit"]:focus{
    color: black;
    background-color: white;
}

input:not(:focus) + .poptip {
    transform: scale(0);
    animation: elastic-dec .25s;
}
input:focus + .poptip {
    transform: scale(1);
    animation: elastic-grow .45s;
}
.poptip {
    position: absolute;
    float: right;
    display: inline-block;
    width: 236px;
    font-size: 13px;
    padding: .6em;
    background: #fafafa;
    /*position: relative;*/
    /*margin-left: -3px;*/
    /*margin-top: 3px;*/
    margin: 10px 10px;
    border-radius: 2px;
    filter: drop-shadow(0 0 1px rgba(0, 0, 0, .23456));
    transform-origin: 15px -6px;
}
.poptip::before {
    content: "";
    position: absolute;
    /*top: -6px; */
    /*left: 10px;*/
    /*border: 9px solid transparent;*/
    left: -20px;
    border-radius: 8px;
    border-right-color: #fafafa;
}
.verifyCodeFrom{
    visibility: hidden;
    float: left;
    position: absolute;
    margin: 0px 10px;
    display: inline-block;
}
.verifyCodeImg{
    margin: 5px;
}
@keyframes elastic-grow {
    from {
        transform: scale(0);
    }
    70% {
        transform: scale(1.1);
        animation-timing-function: cubic-bezier(.1, .25, .1, .25);
    }
}
@keyframes elastic-dec {
    from {
        transform: scale(1);
    }
    to {
        transform: scale(0);
        animation-timing-function: cubic-bezier(.25, .1, .25, .1);
    }
}
```

##### bookList.css

```css
body{
    background: linear-gradient(-45deg, #ff2a2a, #b6e5f8);
    animation: gradientBG 8s ease infinite;
    background-size: 400% 400%;
}
@keyframes gradientBG{
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
.dropdown:hover .dropdown-menu {
    display: block;
}
.newBookTable{
    margin-top: 500px;
}
```

#### js

##### register.js

```javascript
window.onload=function(){
    var displayKaptchaBtn=document.getElementById("displayKaptcha");
    var verifyCodeFrom=document.getElementsByClassName("verifyCodeFrom");
    var registerForm=document.getElementById("registerForm");

    displayKaptchaBtn.addEventListener('click',function () {
        verifyCodeFrom[0].style.visibility='visible';
    })
}
```



## 结束

