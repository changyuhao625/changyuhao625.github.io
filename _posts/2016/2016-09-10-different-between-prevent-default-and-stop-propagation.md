---
layout: post
title: "[jQuery] event.preventDefault() 與 event.stopPropagation() 的差異"
tags: ["jQuery"]
category: tech
author: Harry Chang
---

我們在撰寫前端畫面時，常常會使用 <span style="color:#0000FF;">return false</span> 來終止函數運行，其實return false 會包含以下三種行為：

1.  event.preventDefault()
2.  event.stopPropagation()
3.  停止函數並回傳

第三點應該大家都知道，畢竟寫<span style="color:#0000FF;"> return false</span> 就是為了這件事情呀，但是大家不知道其實JavaScript 默默幫我做了1跟2，結果可是差很多的呢！

 <!--more-->

描述一下這兩個的差異：

### <span style="color:#0000FF;">event.preventDefault()</span>

就是<span style="color:#008000;">**終止預設行為(Stop Event Flow)**</span>；以「超連結」為例，瀏覽器看到頁面上有超連結，只要偵測到超連結被點擊到，隨即會幫我做「導向連結」的動作，「導向連結」即是超連結的預設行為。

如下，我對hyper註冊了一個Click 事件，並且使用了<span style="color:#0000FF;">event.preventDefault()</span>，此時hyper就不再為我們進行導頁的動作，因為我們已經停止了他的預設行為。
~~~ html
    <a id="hyper" href="https://dotblogs.com.tw/harry">Harry's Tech World</a>
    <script type="text/javascript">

    $("#hyper").click(function()
    {
        //終止預設行為
        event.preventDefault();
    });

    </script> 
~~~

### <span style="color:#0000FF;">**event.stopPropagation()**</span>

這個比較難懂一點，這個語法是用來**<span style="color:#008000;">終止事件傳導</span>**，直接舉個例子來看比較好懂。

    <code class="language-html"><div id="div1">
       <a id="hyper" href="https://dotblogs.com.tw/harry">Harry's Tech World</a>
    </div>
    <script type="text/javascript">

    $("#hyper").click(function()
    {
      //終止預設行為
      event.preventDefault();
      console.log("hyper click");
    });

    $("#div1").click(function()
    {
      console.log("div1 click");
    });
    </script></code>

如上圖，我們點擊超連結的時候，console 顯示訊息的順序為「hyper click」>「div1 click」，

這個結果很合理，原因是因為我們點擊超連結後browser先幫我們執行了hyper所註冊的Click 事件，

接著因為我們的hyper被包在div 裡面，進而div所註冊的事件就被「傳導」到了hyper上，

所以當我們點擊了hyper的同時不只自己本身的Click事件被觸發，連同div 所註冊的事件也會被觸發，這個結果就是所謂的事件傳導。

當然若我們不希望有這個結果，只要加入<span style="color:#0000FF;">event.stopPropagation()</span>就不會有事件傳導的結果囉，如下：

    <code class="language-html"><div id="div1">
       <a id="hyper" href="https://dotblogs.com.tw/harry">Harry's Tech World</a>
    </div>
    <script type="text/javascript">

    $("#hyper").click(function()
    {
      //終止預設行為
      event.preventDefault();
      //終止事件傳導
      event.stopPropagation();
      console.log("hyper click");
    });

    $("#div1").click(function()
    {
      console.log("div1 click");
    });
    </script></code>

所以在使用者兩個方法上，要再多加注意唷！

                