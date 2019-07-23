---
layout: articles
title: "[jQuery] $.isEmptyObject 小提醒 !"
tags: ["jQuery"]
category: tech
author: Harry Chang
---

專案上很多前端驗證都會使用jQuery「$.isEmptyObject」來檢核參數是否為空，

但在驗證布林值確都回傳true 的結果，意思是「他是一個空物件」???

查了一下API 發現原來這個Function 在使用上是有限制的，

 <!--more-->

他只能查詢「單純的JavaScript 物件」，且不同的瀏覽器對「單純的JavaScript 物件」的定義可能不太一樣，

我們在Chrome試一下得到以下結果，

~~~ javascript
    var boolValue = true;
    var numValue = 123;
    var floatValue = 12.34;
    var strValue = "string"

    console.log($.isEmptyObject(boolValue));
    //結果：true
    console.log($.isEmptyObject(numValue));
    //結果：true
    console.log($.isEmptyObject(floatValue));
    //結果：true
    console.log($.isEmptyObject(strValue));
    //結果：false
    console.log($.isEmptyObject(""));
    //結果：true
    console.log($.isEmptyObject(null));
    //結果：true
    console.log($.isEmptyObject({}));
    //結果：true
    console.log($.isEmptyObject({a:""}));
    //結果：false
~~~

結果為：

數字型態的都無法正常使用「$.isEmptyObject」判斷，字串在空字串與非空字串可以正常判斷，另外，在標準物件也可以正常判斷。

官方文件有寫道，要如何目前參數是否為簡單物件，可以使用「$.isPlainObject()」這個Function是用來判斷參數是否為簡單物件的，

我們簡單試一下，

~~~ javascript
    var boolValue = true;
    var numValue = 123;
    var floatValue = 12.34;
    var strValue = "string"

    console.log($.isPlainObject(boolValue));
    //結果：false
    console.log($.isPlainObject(numValue));
    //結果：false
    console.log($.isPlainObject(floatValue));
    //結果：false
    console.log($.isPlainObject(strValue));
    //結果：false
    console.log($.isPlainObject(""));
    //結果：false
    console.log($.isPlainObject(null));
    //結果：false
    console.log($.isPlainObject({}));
    //結果：true
    console.log($.isPlainObject({a:""}));
    //結果：true
~~~

奇怪的是連字串型態都被判斷為複雜物件，也就是說字串型態「可能」在某些情況下也會有誤判的情形，

而只有單純的物件型態「{}」是可以正常的判斷的，所以使用上一定要多加注意!!!              