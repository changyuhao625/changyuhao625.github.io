---
layout: post
title: "[Asp .Net MVC] ActionLink 頁面跳轉異常的問題"
tags: ["Asp .Net MVC"]
category: tech
author: Harry Chang
---

專案上碰到HyperLink 自動被加上了Area Name ，一來一往越來越多Area Name ，導致 Routing 異常的錯誤。

公司使用的是MVC 架構，專案目錄如下圖：

![](https://az787680.vo.msecnd.net/user/harry/a2f9c015-2677-4e11-9c86-af3799faf640/1460512543_10344.png)標準 MVC 資料夾結構，其中Controller 我擺了一個AccountController ，

這個控制器是專門用來做系統權限控管的，簡單來說就是登入登出功能。

系統登入後會預設導入到 Start Areas 裡的 DashBoardController，

![](https://az787680.vo.msecnd.net/user/harry/a2f9c015-2677-4e11-9c86-af3799faf640/1460513228_19499.png)

我在MasterLayout 利用HtmlHelper 建立了一個HyperLink 用來登出，
~~~ cs
   @Html.ActionLink("登出", "LogOut", "Account", "", new { @class = "icon-off" })
~~~
但是，我在登入後HtmlHelper 幫我製作出的連結長得很怪，
~~~ html
    <a class="icon-off" href="/xxxxx/Start/Account/LogOut?Length=0">登出</a>
~~~
自動在前面多了Area Name ，但是MVC Routing 一樣可以幫我們Routing 到正確的控制器上做登出的動作，

但登出後就很奇怪了，Url 變成這樣！！

![](https://az787680.vo.msecnd.net/user/harry/a2f9c015-2677-4e11-9c86-af3799faf640/1460513763_47081.png)但是登入功能依然可以被Routing 到，我們我們登入後再來看看HtmlHelper 做出來的HyperLink 長成怎麼樣，

結果！！
~~~ html
    <a class="icon-off" href="/xxxxx/Start/Start/Account/LogOut?Length=0">登出</a>
~~~
 竟然又多了一個Area Name，網址列也是！！

![](https://az787680.vo.msecnd.net/user/harry/a2f9c015-2677-4e11-9c86-af3799faf640/1460514384_01418.png)

登出後再登入就出現問題了，

![](https://az787680.vo.msecnd.net/user/harry/a2f9c015-2677-4e11-9c86-af3799faf640/1460514780_26977.png)

多了一堆的Area Name ！！

後來查明原因為，我們套MasterLayout ，若專案上是有切割Area ，並且登入後會導到該Area 底下的功能時，

HtmlHelper ActionLink 會預設幫我們加上Area Name，雖然一開始Rauting 的到，到往返幾次後，加了越來越多的Area Name，

最後Routing不到就會出現錯誤。

解決方法其實很簡單，我們稍微修改 ActionLink 的寫法，
~~~ cs
    @Html.ActionLink("登出", "LogOut", "Account", new { area = string.Empty }, new { @class = "icon-off" })
~~~

我們強制 area 等於空的，此時HypeLink 就不會自動加上AreaName，即可解決上述問題！

這是小弟的第一篇文章，內容若有誤，還請指教，謝謝！