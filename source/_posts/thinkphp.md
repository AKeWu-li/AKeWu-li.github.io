---
title: ThinkPHP
date: 2021-08-28 18:40:56
updated:
tags: ['ThinkPHP']
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
[ThinkPHP6.0完全开发手册](https://www.kancloud.cn/manual/thinkphp6_0/1037479)
[ThinkPHP6.0学习视频](https://www.bilibili.com/video/BV12E411y7u8)
## 开始
### URL正确跳转
两种方法
#### 1.设置伪静态，即[URL重写](https://www.kancloud.cn/manual/thinkphp6_0/1037488)
将以下内容保存为.htaccess文件放到应用入口文件的同级目录下（ThinkPHP自动创建，在public文件下）
```bash
Apache
<IfModule mod_rewrite.c>
  Options +FollowSymlinks -Multiviews
  RewriteEngine On

  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteRule ^(.*)$ index.php/$1 [QSA,PT,L]
</IfModule>
Nginx
if (!-e $request_filename){
rewrite ^(.*)$ /index.php?s=$1 last; break;
}
```
#### 2.跳转地址加入?s=
如HTML中的&#60;a&#62;标签的属性href="Index/main"在未设置伪静态时访问出现404错误，改成href="?s=Index/main"即可正常访问
##### 关于验证码问题，未设置伪静态时图片无法显示（同样404错误）
在vendor\topthink\think-captcha\src\helper.php的captcha_img方法中更改return语句
```bash
return "<img src='?s={$src}' alt='captcha' " . $domid . " onclick='this.src=\"?s={$src}?\"+Math.random();' />";
```
<!-- more -->
### 开启Session
```language
app目录下全局中间件文件middleware.php将'think\middleware\SessionInit'注释取消
```
### 验证码
#### 安装
```language
composer require topthink/think-captcha
```
#### 使用
```language
<div>{:captcha_img()}</div>
```
### phpmailer
#### 安装
```bash
composer require phpmailer/phpmailer
```
#### 使用
##### 邮箱发送验证码
```bash
public function sendMail(){
  $mailCode=$this->createMailCheckCode();
  session("mailCode",$mailCode);
  $username=session("registerData")["username"];
  $receiveMailAddress=session("registerData")["email"];
  try {
    $mail = new PHPMailer();
    $mail->isSMTP();
    $mail->CharSet = "utf8";
    $mail->Host = "smtp.163.com";// 发送方的SMTP服务器地址
    $mail->SMTPAuth = true;// 是否使用身份验证
    $mail->Username = "";// 发送方的163邮箱用户名
    $mail->Password = "";// 发送方的邮箱密码,客户端授权密码
    $mail->SMTPSecure = "ssl";// 使用ssl协议方式
    $mail->Port = 465;// 163邮箱的ssl协议方式端口号是465/994
    $mail->setFrom("","Ori官方");// 设置发件人信息
    $mail->addAddress($receiveMailAddress,'用户');// 设置收件人信息
    //$mail->addReplyTo("***@qq.com","回复人姓名");//
    //$mail->addCC("xxx@163.com");// 设置邮件抄送人
    //$mail->addBCC("xxx@163.com");// 设置秘密抄送人
    //$mail->addAttachment("bug0.jpg");// 添加附件
    $mail->Subject = "Ori验证码邮件";// 邮件标题
    $mail->isHTML(true);// 邮件正文为html格式
    // 邮件正文
    $mail->Body = ;
    if(!$mail->send()){// 发送邮件
      echo "Mailer Error: ".$mail->ErrorInfo;// 输出错误信息
  }else{
    return \view("mailCode");
  }
}catch (ValidateException $exception){
  dump($exception->getError());
}
alerts("发送失败，请稍后再试!");
return \view("register");
}
//生成随机验证码
public function createMailCheckCode($length = 6){
  $min = pow(10 , ($length - 1));
  $max = pow(10, $length) - 1;
  return rand($min, $max);
}
```
## 结束
哒哒哒