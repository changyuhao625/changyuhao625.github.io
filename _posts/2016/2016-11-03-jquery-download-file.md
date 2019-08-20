---
layout: post
title: "[jQuery] 為何不能透過 ajax 直接下載檔案?"
tags: ["jQuery","ajax"]
category: tech
author: Harry Chang
---

## 前言
在實作檔案下載時，我們通常會透過<span style="color:#0000FF;">location.href() 、window.open()、iframe </span>等方式來下載檔案，

詳細實作方式可以參考黑暗執行緒的「[透過Javascript觸發檔案下載](http://blog.darkthread.net/post-2011-08-12-ajax-download-with-iframe.aspx)」，

那為何不行透過 ajax 來下載檔案呢 ?

<!--more-->

我們可以從以下兩個面向來探討「為何不能使用 ajax 來下載檔案」：

## ajax

ajax 其中一項最重要的作用是「非同步處理」，即我們可以透過 ajax 發出 HttpRequest 向伺服器索取我們想要的資料，

且我們的畫面不需要為了取得部份的資料，而刷新整個頁面；

當然好處還很多，不過我想最重要的一點就是「跟伺服器要資料到前端來處理」，

所以我們去看[jQuery 官方文件](http://api.jquery.com/jquery.ajax/)，可以看到 ajax 支援的回傳格式（dataType） 有 xml, json , script 或是 html，

可以發現全部都是屬於「文字」型態的格式，也就是說ajax 本身就不是設計來下載檔案使用的。

## JavaScript

假設我們真的可以取得檔案資料(binary) ，但也不可能直接透過JavaScript 將檔案存在我們本機端，

原因是因為，只要有心人士對我們的網頁植入惡意Script ，他就能瘋狂地幫我們下載檔案，這樣不是很恐怖嗎？

換句話說，<span style="color:#0000FF;">瀏覽器會阻止JavaScript 直接「存取」本機端的資源，以避免遭受惡意攻擊</span>。

---

以上是「為何不能使用 ajax 來下載檔案」的原因。常常我們在寫程式時都「知其然，而不知所以然」，

有時這些小細節卻會演變成大問題，提醒自己也提醒大家。

參考：

[http://stackoverflow.com/questions/14682556/why-threre-is-no-way-to-download-file-using-ajax-request](http://stackoverflow.com/questions/14682556/why-threre-is-no-way-to-download-file-using-ajax-request)               