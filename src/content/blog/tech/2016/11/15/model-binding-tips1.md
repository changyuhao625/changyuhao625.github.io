---
title: "[Asp.Net MVC] An item with the same key has already been added！"
date: 2016-11-15
category: tech
tags: ["Asp.Net MVC", "Model Binding", "DefaultModelBinder"]
author: "Harry Chang"
description: "Asp.Net MVC 執行時出現「An item with the same key has already been added」+「System.Web.Mvc.DefaultModelBinder.BindProperty」錯誤，原因是 Model Binding 不區分大小寫：子類別的 Email 與父類 BaseModel 的 email 會被視為同一 key。"
---

「<span style="color:darkred;">*An item with the same key has already been added*</span>」系統執行到一半，突然跳出這個訊息，

仔細看一下錯誤訊息有一段寫道「<span style="color:#FF0000;">*System.Web.Mvc.DefaultModelBinder.BindProperty...*</span>」，

於是朝Model Binding 異常的方向前進。

<!--more-->

首先看一下我們的Model：
~~~ cs
        public class InputModel : BaseModel
        {
            public string Email { get; set; }
            //...
        }
~~~

看起來很正常，而且我也確定前端Request 回來的資料，名稱是吻合的，

但錯誤訊息顯示「<span style="color:#FF0000;">*An item with the same key has already been added*</span>」，代表一定有什麼地方重複了，

仔細看一下，BaseModel：
~~~ cs
        public class BaseModel
        {
            public string email { get; set; }
        }
~~~

有一個「email」 但跟「Email」不同，首個字母一個是大寫，另一個是小寫，

原來<span style="color:#0000FF;">Model Binding 是不分大小寫的！</span>這個地方要特別小心！

補充：

另外有一些特例，像是我們透過url query string 把資料帶回來，但若Action 強型別為Enum 這時又分大小寫了，

可以參考[Model-binding is being case-sensitive when binding Url data to Enum parameter](https://github.com/aspnet/Mvc/issues/913)               