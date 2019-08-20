---
layout: post
title: "[Asp.Net] 檔案上傳長度限制"
tags: ["Asp.Net"]
category: tech
author: Harry Chang
---

今天在測試檔案上傳時，發現上傳特定幾個檔案時會失敗，

Log 顯示「<span style="color:#FF0000;">*System.Web.HttpException (0x80004005): 超出最大的要求長度*</span>」，

<!--more-->

查了一些相關文件，原來是Asp.Net 預設限制每一次的HttpRequest 為 4096 kb(4MB)，

所以只要超過此限制，就會出現Internal Server Error，

這個限制主要是避免有人惡意傳送大型檔案給伺服器 ，近一步造成伺服器異常，

當然若要解除限制，只需要在Config 加入以下參數，
~~~xml 
<configuration>
      <system.web>
        <httpRuntime targetFramework="4.5" maxRequestLength="2147483647" executionTimeout="1600" requestLengthDiskThreshold="2147483647" />
      </system.web>
    </configuration>
~~~

  *   maxRequestLength: 每一次 HttpRequest 的最大長度(預設4096 kb) 
  *   requestLengthDiskThreshold:  HttpRequest 資料串流的Buffer ，一般來說不會超過 maxRequestLength（預設80 kb）
  *   executionTimeout: 每一次 HttpRequest 執行超過多久就要Time Out(預設 110秒)

以上希望可以對大家有幫助。

另外，Json 資料長度其實也有長度限制，可以參考這篇「[[Asp .Net MVC] JavaScriptSerializer vs Json.Net](https://dotblogs.com.tw/harry/2016/05/11/102843)」。

參考：

[HttpRuntimeSection.MaxRequestLength 屬性](https://msdn.microsoft.com/zh-tw/library/system.web.configuration.httpruntimesection.maxrequestlength(v=vs.110).aspx)

[HttpRuntimeSection.RequestLengthDiskThreshold 屬性](https://msdn.microsoft.com/zh-tw/library/system.web.configuration.httpruntimesection.requestlengthdiskthreshold(v=vs.110).aspx)

[HttpRuntimeSection.ExecutionTimeout 屬性](https://msdn.microsoft.com/zh-tw/library/system.web.configuration.httpruntimesection.executiontimeout(v=vs.110).aspx)

[ASP.NET 當上傳檔案過大時任何回應瀏覽器的動作都無效](http://blog.miniasp.com/post/2008/01/26/When-POST-content-exceed-maxRequestLength-any-HTTP-responses-are-useless.aspx)

                