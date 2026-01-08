---
title: linux命令
date: 2022-04-22 08:46:45
tags: ["Linux"]
---

[参考文章](https://blog.csdn.net/weixin_44191814/article/details/120091363?spm=1001.2101.3001.6650.4&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-4.pc_relevant_paycolumn_v3&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-4.pc_relevant_paycolumn_v3&utm_relevant_index=7)

## 开始

### Linux文件目录结构

![linux文件目录结构](linux_file_structure.jpg)

### 简单系统命令

```language
1.查看ip地址
ip a
2.ping网络(测试网络连通)
ip 目标机器的ip
3.查看系统时间
date
4.注销
logout
5.关机
shutdown now
6.重启
reboot
7.清屏
clear
```

<!-- more -->

### 文件相关命令

#### 文件管理命令

```language
1.查看文件列表
ls [-参数1参数2] [目标文件夹]
-l 查看详细信息，元数据信息(用户、组、大小、创建时间、权限信息、文件类型)
-a 查看隐藏文件
2.切换目录
cd 目标文件夹
3.查看当前命令所在的目录
pwd
~ 当前用户的home目录
. 当前目录
.. 上一级目录
4.新建文件夹及文件
在当前位置新建文件夹
mkdir 文件夹名
在指定目录位置，创建文件夹，并创建父文件夹
mkdir -p /a/b/文件夹名
在当前目录下新建文件
touch 文件名
5.删除文件
rm [-参数1参数2] 文件名
-r 删除文件夹
-rf 强制删除不询问
6.拷贝文件
cp 原文件  新文件
-r 拷贝文件夹
7.移动文件或修改文件名
mv 文件  文件夹
```

#### 文本内容查看命令

```language
1.cat
查看文件中的全部信息(适合查看小文档)
2.less
以分页的方式浏览文件信息(适合查看大文档)，进入浏览模式
浏览模式快捷键
↑ 上一行
↓ 下一行
G 第一页
g 最后一页
空格 下一页
/关键词 搜索关键词
q 退出
3.tail
实时滚动显示文件的最后10行信息(默认10行)
tail -f 文件名
显示文件的最后20行信息
tail -n 20 文件名
tail -n -20 文件名
显示文件信息从第20行至文件末尾
tail -n +20 文件名
```

#### 文件查找

```language
1.查找文件名
find 搜索路径 -name "文件名关键词"
2.查找文件内容
grep -参数 要查找的目录范围
-n 显示查找结果所在行号
-R 递归查找目录下的所有文件
```

#### 输出

````language
将命令1的执行结果，输出到后面的文件中
1.覆盖写入
命令1 > 文件
2.追加写入
命令1 >> 文件
````

### 进程相关命令

```language
1.ps -aux
静态查看系统进程
2.top
实时查看系统进程
↑ 下翻
↓ 上翻
q 退出
3.kill 进程id
关闭进程
```

### 权限相关命令

![用户权限说明](user_permission_illustrate.jpg)

#### 用户组

```language
1. 创建组
groupadd 组名
2. 删除组
groupdel 组名
3. 查找系统中的组
cat /etc/group | grep -n “组名”
说明：系统每个组信息都会被存放在/etc/group的文件中
```

#### 用户

```language
1.创建用户
useradd -g 组名 用户名
2.设置密码
passwd 用户名
3.切换用户
su 用户名
4.删除用户
userdel -r 用户名
系统每个用户信息保存在/etc/passwd文件中
```

#### 文件权限

```language
1.设置文件所有者
语法：chown [-R] user名:group名 文件名
参数：-R 如果是文件夹，需要使用这个参数，可以将文件夹及其内部所有文件的所有者和组全部修改
注意：命令权限需要root
修改文件所有者
chown 用户名 文件名
修改文件所属组
chown :组名 文件名
修改文件所有者和所属组
chown 用户名:组名 文件名
修改文件夹的所有者和所属组
chown [-R] 用户名:组名 文件夹
2.权限设置
语法：chmod u±rwx,g±rwx,o±rwx 文件名
运算符：
- 删除权限
+ 添加权限
= 赋值权限
给文件的所有者添加执行权限
chmod u+x 文件名
给文件的其他人删除所有权限
chmod o-rwx 文件名
给文件的所属组设置读写权限
chmod g=wx 文件名
```

### 软件相关命令

#### 压缩与解压

```language
1.压缩
tar -zcvf 压缩后文件名 被压缩文件
2.解压缩
tar -zxvf 压缩文件名 -C 解压后文件所在目录
```

![压缩与解压缩参数说明](compressed_parameter.jpg)

#### rpm

```language
1.安装rpm软件
rpm -ivh xxx.rpm
2.查看系统中是否已安装的过该rpm软件
rpm -qa 软件名
3.卸载rpm软件
rpm -e 软件名
```

#### yum

```language
yum基于rpm实现的，提供了除了rpm的安装软件、卸载软件等功能以外还有，自动查找、下载软件并自动处理软件的彼此之间的依赖关系，下载并安装依赖包。
```

```language
1.列出所有可以安装的软件包
yum list
2.安装软件
yum install -y 软件名
3.卸载软件
yum remove 软件名
4.查找软件包
yum search all 软件名
```

#### 服务

```language
1.服务器管理命令
systemctl status 服务名
2.启动服务
systemctl start 服务名
3.重启服务
systemctl restart 服务名
4.停止服务
systemctl stop 服务名
5.禁止服务随linux启动。
systemctl disable 服务名
6.设置服务随linux启动。
systemctl enable 服务名
如防火墙的服务名为firewalld
```

#### SSH

```language
ssh [-p port] user@remote
user 是在远程机器上的用户名，如果不指定的话默认为当前用户
remote 是远程机器的地址，可以是IP/域名，或者是别名
port 是SSH Server监听的端口，如果不指定，就为默认值22
```

#### SCP

```language
scp [可选参数] file_source file_target
-r 复制目录
如本地文件复制到远程：scp local_file remote_username@remote_ip:remote_folder 
```



## 结束

