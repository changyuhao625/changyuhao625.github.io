---
layout: articles
title: "NHibernate] Session 與 Lazy Loading"
tags: ["NHibernate","Session"]
category: tech
author: Harry Chang
---

## 前言

NHibernate 最有特色的一個機制就是「Session」，一般來說我們透過NHibernate 做CRUD 都是對Session進行操作，

這邊不深入探討「Session」底層是如何運作的，有興趣可以參考[這篇文章](http://openhome.cc/Gossip/HibernateGossip/Session.html)！

這篇文章是要探討Session 與 LazyLoading 共同運作下所發生什麼問題。

 <!--more-->

## 前情提要

產品的 Service Layer 做完應做的商業邏輯後，會Call流程引擎，流程引擎也會做一些流程資料流的商業邏輯，

這邊就簡稱 Flow Layer ，畫簡單流程圖會像下面這張圖，

![](https://az787680.vo.msecnd.net/user/harry/812ef1f8-5d97-4206-8441-c7e9799801ca/1481684612_33206.png)

當然，從Controller Call Service Layer 的那個瞬間，就已經進入 NHibernate 的 Session 控管之下了。

## 問題探討

問題：

我們在Service Layer 透過 Session 儲存了一個實體「A」以及「B」，「A」與「B」是一對一 映對的關係，

Service Layer 的程式碼如下：
~~~ cs
    public class Service1
    {
      public void Active(){
        //實體「A」存檔
        Session.Save(new A(){
         Pk1="1234"
           //Data...
        });

        //實體「B」存檔
        Session.Save(new B(){
           //Data...
          Pk1="1234"
        });

        //Call Flow Service
        FlowService.Do("1234");     
      } 
    }
~~~

Flow Layer 的程式碼如下：
~~~cs
    public class FlowService
    {
      public void Do(string pk){
        //透過 Session Get實體「A」
        var A=Session.Get<A>(pk);

        //透過 Lazy Loading Get 實體「B」
        var B=A.B; 

        //透過 Session Get實體「a」
        var B1=Session.Get<B>(pk);
      } 
    }
~~~

有趣的事情發生了，「B」竟然是空的！但 「B1」有值，

所以代表「B」的實體確實有被新增到 Session 裡面，但卻無法透過 實體「A」的 Lazy Loading 取得到。

那我們再做一個實驗：

Service Layer：
~~~ cs
    public class Service1
    {
      public void Active(){
        //new 一個 實體 A出來
        var A= new A(){
         Pk1="1234"
         //Data...
        };

        //把A的映對B做初始化
        A.B=new B(){
         Pk1="1234"
         //Data...
        };

        //實體「A」存進Session
        Session.Save(A);

        //Call Flow Service
        FlowService.Do("1234");     
      } 
    }
~~~

Flow Layer：
~~~ cs
public class FlowService
    {
      public void Do(string pk){
        //透過 Session Get實體「A」
        var A=Session.Get<A>(pk);

        //透過 Lazy Loading Get 實體「B」
        var B=A.B; 

        //透過 Session Get實體「B」
        var B1=Session.Get<B>(pk);
      } 
    }
~~~

Flow Layer 的程式碼都沒有動，唯一的差別是 Service Layer 的程式碼，

我們先把「B」初始化指給「A」，再一次存進Session 底下，

但這時候「B」與「B1」都有值了，為何這時候Lazy Loading 就成功了???

## 問題解析

再讓我們仔細挖掘下去，透過Profiler 發現其實Lazy Loading 的機制並沒有啟動，

原來是NHibernate 在 Get 的時候，直接把我們剛剛在Service Layer 儲存的物件，再丟回來給我們，

也就是因為這樣，在「A」有指定「B」的情況下，我們可以直接透過「A」拿到「B」，而沒有指定的情況下「A」就拿不到「B」，

而這種情形下的實體，NHibernate 也不會再幫我啟動Lazy Loading 的機制了。

這樣的做法對系統效能上是良好的，因為Session 裡面本身就有我們的資料，何必再花一次連線回去要資料呢？

看起來不是很好懂，可以直接動手試試看，就可以了解其中的端倪。          