---
layout: post
title: "[NHibernate] Session Update 奇怪的寫法"
tags: ["NHibernate"]
category: tech
author: Harry Chang
---

最近在做產品的產品，底層是使用NHibernate，Review 時發現同仁在 Update Table 有一些多餘的寫法，

 <!--more-->

如下：

~~~ cs
var apply = Session.Get<Apply>("key123");
    apply.Usr="Harry";
    Session.Update(apply);
    Session.Flush();
~~~

先透過Session Get Table 資料，改完值後再Update，

看起來很直覺，但其實沒有必要，直接這樣即可，

~~~ cs
    var apply = Session.Get<Apply>("key123");
    apply.Usr="Harry";
    Session.Flush();
~~~

因為NHibernate 會監控Load 出來的物件，只要有異動該物件就會直接幫我們異動Table了。