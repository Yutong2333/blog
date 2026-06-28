---
title: 云服务器+Openlist+网易爆米花搭建远程家庭影院
published: 2026-06-28
pinned: false
description: 在云服务器部署Openlist搭建媒体库并在网易爆米花上播放。
tags: [Openlist,媒体库,云服务器]
category: 网上那些事
draft: false
image: "./Media-Library.avif"
---

## 🎥前言

你是否还在动用澳门的人脉在网页上看电影呢，画质差，还有广告在网页上飘，影响观看体验。用Openlist在云服务器上搭建媒体库并用网易爆米花/VidHub播放，实现远程家庭影院功能，随时随地用任何设备获得最佳的观影体验！
![网易爆米花界面](./Media-Library1.avif)
![播放器自带海报刮削](./Media-Library2.avif)
*注意*：搭建Openlist之后还需要添加存储驱动，一般是用网盘做存储（需要网盘会员）

## 部署1Panel和Docker

首先我们需要准备一个云服务器，2H2G的轻量云服务器已经够用了，各大厂商每年都会搞各种活动，这个配置的轻量云通常一年三四十块钱足以。

[官方文档](https://doc.oplist.org.cn/)提供了非常多的安装方式，我将通过[1Penal](https://1panel.cn/)来部署，先给服务器选择安装一个系统镜像（CentOS、Ubuntu、Debian都可以，选择比较新的版本防止安装Docker失败），下载一个管理SSH的工具，这里我用的是[宝塔的SSH终端](https://www.bt.cn/new/product_ssh.html)。在SSH终端添加云服务器：
![填写云服务器信息](./Media-Library3.avif)
双击左边刚才添加的服务器：
![登录成功的页面](./Media-Library4.avif)
运行安装脚本：
```bash
bash -c "$(curl -sSL https://resource.fit2cloud.com/1panel/package/v2/quick_start.sh)"
```
安装过程中会提示安装什么语言版本，选择2.Chinese中文(简体)<br>
安装路径照着它默认填/opt就行
![默认路径/opt](./Media-Library5.avif)
检测到未安装Docker，是否安装：输入y，安装<br>
安装Docker需要一些时间，等待安装完成不要关闭窗口

是否配置镜像加速：y<br>
设置1Penel端口：自行设置，记得云服务器里的防火墙开放自己设置好的端口<br>
设置 1Panel 安全入口、用户名、密码：自行设置，务必记住<br>
部署成功后的会显示外部地址
![部署成功](./Media-Library6.avif)

## 安装Openlist

打开浏览器，输入刚才SSH终端显示的外部地址，将会打开自己部署的1Panel登录页面，输入自己设置好的用户名和密码登录
![登录1Panel](./Media-Library7.avif)
选择应用商店-搜索Openlist-安装
![安装Openlist](./Media-Library8.avif)
版本号选择最新的，其他默认，<font color='red'>一定要勾选高级设置-端口外部访问</font>，保存，记得云服务器防火墙开放5244、5246端口，确认完毕后等待安装完成

点击容器-容器，将会看到我们刚才安装的Openlist在里面
![容器-容器-终端](./Media-Library9.avif)
容器列表点击“终端”，进入容器内执行命令设置密码。选择一个自己喜欢的设置密码方式<br>
生成随机密码:：
```bash
./openlist admin random
```
手动设置密码：
```bash
./openlist admin set NEW_PASSWORD
```
![点击“连接”，选择其中一串指令设置密码](./Media-Library10.avif)

## 启动Openlist服务器

浏览器打开服务器公网ip:5244进入Openlist登录页面

用户名admin，密码是刚才自己设的

登录页面进去后点击“管理”<br>
进入管理页面后点击设置-全局-把“签名所有”关掉，勾上“写入操作后触发目录更新钩子”，“目录更新钩子遍历限制速率”设置成2，保存

## 添加存储驱动

点击存储-添加-添加自己的网盘，这里我添加我的夸克网盘
![根据官方文档所示，夸克网盘的驱动选择Quark TV更稳定更适合用来播放影视资源](./Media-Library12.avif)
挂载路径随便起，相当于创建一个文件夹-WebDav策略一定要选<font color='red'>302重定向</font>让视频播放时直接走网盘的缓存流量，不然会走你的云服务器的流量-链接方法选择<font color='red'>流式</font>-添加（第一次添加会报错，不用管），重新进入管理页面-存储
![手机夸克APP扫码登录](./Media-Library13.avif)
扫完码重新点击编辑-保存即可
![显示工作中就是成功了](./Media-Library14.avif)
返回首页会显示网盘中的内容
![界面已经显示网盘的资源](./Media-Library15.avif)
现在，你可以选择直接点击文件在网页端直接看，但不建议，网页端解码能力差，而且没有好看的海报刮削，找起视频来也麻烦

重新回到管理页面，点击用户-找到admin，编辑-勾选<font color='red'>WebDav管理</font>和<font color='red'>WebDav读取权限</font>-保存（这一步你也可以创建一个新的用户，只给webdav读取和管理权限，更安全）
![给予账号WebDav权限](./Media-Library16.avif)
下面我们接着开始添加媒体库到播放器

## 导入媒体库

手机下载[网易爆米花](https://bmh.163.com/)APP（用VidHub播放器也行，网易爆米花免费，帐号登录在不同客户端可以同步播放历史记录），注册一个网易账号登录。

点击资源库-点击右上角的加号-WebDav-填入信息-保存
![参照我的填入信息](./Media-Library17.avif)
填入信息保存成功后，选择我们有资源的文件夹-导入
![参照我的填入信息](./Media-Library18.avif)
导入过程中需要一些时间，耐心等待，添加完成后就会在媒体库里出现你的资源啦
![媒体库界面](./Media-Library19.avif)

## 如何添加新的资源

在网盘中把你找到的资源添加到网盘文件夹中，然后在网易爆米花APP里找到你添加的WebDav,点击要更新的文件夹，选择自动识别
![添加新资源](./Media-Library20.avif)
识别完成后媒体库里就会有新的内容显示。<br>
至此已经部署完成，因为是云服务器搭建的媒体库，所以在哪都能看，而且网易爆米花有手机端PC端和TV端，扫码登录你的网易账号就可以实现播放历史记录同步了
![播放示例](./Media-Library21.avif)