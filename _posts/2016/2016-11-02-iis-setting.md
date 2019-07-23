---
layout: articles
title: "[Asp.Net MVC] MVC 網站部署失敗"
tags: ["Asp.Net MVC"]
category: tech
author: Harry Chang
---

今天部署網站到客戶端的時候，發現一直無法讓網站順利啟動，一直出現以下錯誤，

<span style="color:#FF0000;">*HTTP Error 403.14 - Forbidden  
 The Web server is configured to not list the contents of this directory.*</span>

![](https://az787680.vo.msecnd.net/user/harry/84a01fd4-39cb-43cc-99c4-701ab9b9a7d2/1478078873_62819.png)


查了一些資料，都是在Config 加入「<span style="color:#0000FF;">runAllManagedModulesForAllRequests</span>」這個屬性，並設為 true，

~~~ xml
<system.webServer>
      <modules runAllManagedModulesForAllRequests="true" />
    </system.webServer>
~~~

加入後確實就正常了，但公司的測試機並不會有這個問題，也不需要加入這段設定，

後來查到「[在Windows 2008跑ASP.NET MVC 4](http://blog.darkthread.net/post-2015-05-30-aspnet-mvc-on-win2008.aspx)」這篇文章，發現原來是IIS 與 Windows Server 版本太舊會有這個情形發生，

且加入「<span style="color:#0000FF;">runAllManagedModulesForAllRequests</span>」對效能上會有影響，所以還是將伺服器升級或者安裝補丁，對系統會比較好唷！

參考：

[在Windows 2008跑ASP.NET MVC 4](http://blog.darkthread.net/post-2015-05-30-aspnet-mvc-on-win2008.aspx)

[ASP.NET MVC 4 在 .NET 4.0 與 .NET 4.5 的專案範本差異](http://blog.miniasp.com/post/2013/06/24/ASPNET-MVC-4-IIS-runAllManagedModulesForAllRequests-ExtensionlessUrlHandler.aspx)               