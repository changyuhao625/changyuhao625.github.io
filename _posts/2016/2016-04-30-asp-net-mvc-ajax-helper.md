---
layout: post
title: "[Asp .Net MVC] 使用ValidateAntiForgeryToken FilterAttribute 防範CSRF攻擊!"
tags: ["Asp .Net MVC"]
category: tech
author: Harry Chang
---

最近產品使用標準MVC架構來開發，其中Asp.Net 有提供大量的HtmlHelper來協助開發者製作前端畫面。

為了不要讓使用者有延遲感與系統效能的考量下，我們使用了AjaxHelper，

但Submit 後發現，畫面依然會重新載，並非透過Ajax 做部分區塊的資料更新。

 <!--more-->

首先我們先了瞭解一下AjaxHelper 是如何幫我們達到「非同步更新」的功能。

我們透過 <span style="color:#0000FF;">Ajax.BeginForm</span> 幫我們產生出相對應的Html ，cshtml 的 Code如下：

~~~ cs 
    @using (Ajax.BeginForm("Send", "Apply",
                        new AjaxOptions()
                        {
                            HttpMethod = "POST",//使用何種Http Method
                            UpdateTargetId = "ApplyPartial",//要更新哪一個區塊
                            InsertionMode = InsertionMode.Replace//插入模式「Replace」,「Before」,「After」
                        }))
    {
       //Content
       <button type="submit" class="btn btn-primary" />
    }
~~~

可以看到AjaxHelper 幫我自動產生出Form 的Html 區塊，較特別的是自動幫我加入了「data-ajax="true"」、「data-ajax-method="true"」... ，

![](https://az787680.vo.msecnd.net/user/harry/2c48e05a-e4c1-4a4e-bd73-a6ed63422da1/1462853405_57232.png)但其實加入這些屬性Browser 並不知道要使用ajax 幫我們往後端送資料，一樣會使用一般的Form Submit Post 到後端去。

那該如何讓Form 使用 ajax post 到後端去呢? 那就要使用「<span style="color:#EE82EE;">unobstrusive AJAX</span>」的技術，就可以達到我們的需求，

加入方式非常簡單，使用Nuget 搜尋 「unobstrusive AJAX」並安裝，安裝完畢後專案目錄「Script」下就會多出「jquery.unobtrusive-ajax.js」這個 js， 

在頁面上引用後，Form Ajax 就可以正常啟用啦！

其實「unobstrusive AJAX」做的事情很簡單，他去找出所有包含「<span style="color:#0000FF;">特定屬性</span>」的Form ，並偵測Form 內是否有Submit 事件發生，

若有在使用Ajax 幫我們Post 到後端而已。

*unobstrusive  是一種前端常用的技術，讓前端Html & JavaScript 的職責可以分得更清楚。*

*想了解的人可以參考黑暗執行緒的這篇「[http://blog.darkthread.net/post-2011-07-27-unobtrusive-jquery-validation.aspx](http://blog.darkthread.net/post-2011-07-27-unobtrusive-jquery-validation.aspx)」。*

                