---
layout: post
title: "[Docker] 如何在Windows Server上安裝Docker"
tags: ["Docker","Windows Server"]
category: tech
author: Harry Chang
---

## 前言

最近發現開發環境的Docker非常不穩，常常需要重新啟動Docker服務才會正常，

仔細一查才發現，原來我們的Docker裝的是Desktop版本，所所以只要User Timeout被登出後，

Docker 也會一起被關閉，決定把Docker 換成EE版本的，照著官方說明安裝一直無法順利安裝，

紀錄一下如何將Docker EE安裝到Windows Server上.

<!--more-->

## 1.安裝 Docker-Microsoft PackageManagement

首先，Windows Server的版本至少要是2016以上，且必須安裝最新的更新，

如果在錯誤的版本上，安裝好也會執行不起來唷，

接下來安裝 <span style='color:darkred'>*Docker-Microsoft PackageManagement*</span>

使用PowerShell以系統管理員身分執行以下Script，

~~~ ps
Install-Module -Name DockerMsftProvider -Repository PSGallery -Force
~~~

## 2.安裝Docker

按照官網指示我直接執行以下Script，

~~~ ps
Install-Package -Name docker -ProviderName DockerMsftProvider
~~~

結果，先是出現了以下錯誤，

![docker-install-error-message-1](https://raw.githubusercontent.com/changyuhao625/changyuhao625.github.io/master/images/blog/2019/08/docker-install-error-message-1.png "docker-install-error-message-1")

重開機後，甚至是什麼都沒做就直接結束，仔細看一下錯誤訊息，發現安裝時會去特定的暫存目錄尋找安裝檔(<span>*C:\Users\當前使用者\AppData\Local\Temp\2\DockerMsftProvider\Docker-19-03-1.zip*</span>)

發現該目錄真的沒有那個檔案，因此執行以下Script把檔案下載下來(記得要切到該目錄底下唷!)，

~~~ ps
Start-BitsTransfer -Source https://dockermsft.blob.core.windows.net/dockercontainer/docker-19-03-1.zip -Destination docker-19-03-1.zip
~~~

執行完成後，可以看到該目錄底下真的有那個檔案了，

執行安裝Script

~~~ps
Install-Package -Name docker -ProviderName DockerMsftProvider -Verbose
~~~

結果出現以下錯誤，

![docker-install-error-message-2](https://raw.githubusercontent.com/changyuhao625/changyuhao625.github.io/master/images/blog/2019/08/docker-install-error-message-2.png "docker-install-error-message-2")

網路上一些Solution有提到要先Get SHA256，*其實我對這個步驟有很多疑惑，但執行完後就真的過了...*

~~~ps
Get-FileHash -Path .\docker-19-03-0.zip -Algorithm SHA256
~~~

再執行安裝Script

~~~ps
Install-Package -Name docker -ProviderName DockerMsftProvider -Verbose
~~~
就出現以下成功畫面啦~~~
![docker-install-success-message-1](https://raw.githubusercontent.com/changyuhao625/changyuhao625.github.io/master/images/blog/2019/08/docker-install-success-message-1.png "docker-install-success-message-1")

接著啟動Docker Service

~~~ ps
Start-Service Docker
~~~

再來看看Docker 是否正常啟動

~~~ps
docker info
~~~

看到以下畫面就是成功啦!!!

![docker-install-success-message-2](https://raw.githubusercontent.com/changyuhao625/changyuhao625.github.io/master/images/blog/2019/08/docker-install-success-message-2.png "docker-install-success-message-2")


## 小結

感覺很簡單的幾個步驟，卻卻耗了我不少時間，

建議大家還是直接用Linux 會比較穩定一點唷!

## 參考

[https://github.com/MicrosoftDocs/Virtualization-Documentation/issues/919](https://github.com/MicrosoftDocs/Virtualization-Documentation/issues/919)

[https://docs.microsoft.com/en-us/virtualization/windowscontainers/quick-start/quick-start-windows-server](https://docs.microsoft.com/en-us/virtualization/windowscontainers/quick-start/quick-start-windows-server)