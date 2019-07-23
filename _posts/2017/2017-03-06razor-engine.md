---
layout: articles
title: "[Asp.Net MVC] Razor Engine"
tags: ["Asp.Net MVC"]
category: tech
author: Harry Chang
---

Razor 是MVC 裡面很重要的View Engine，我們在MVC裡面可以很直覺的Return「.cshtml」或是「.vbhtml」的檢視畫面，

但若不在MVC架構上時，該如何Render Razor View 呢？

<!--more-->

RazorEngine 可以幫助我們在非MVC架構上，又需要Render Razor View 時，

可以幫助我們Compile Razor View 轉成標準的Html，來看看該如何使用吧！

首先，先到Nuget安裝「RazorEngine」，

![](https://az787680.vo.msecnd.net/user/harry/7a5be1b7-d6dc-41d9-9f64-63f49d4db54c/1488783415_61372.png)接下來很簡單，只要把檔案丟給RazorEngine 就可以了，如下：

 ~~~ cs
    var template = File.ReadAllText($@"{ AppDomain.CurrentDomain.BaseDirectory}\Areas\Start\Views\Home\RazorView1.cshtml");
    var html =  Engine.Razor.RunCompile(template, "templateName");
~~~

這樣就可以這樣就可以把Razor View 轉換成html了，

當然我們一樣可以給ViewModel，程式碼如下：

~~~ cs
    ViewModel model = new ViewModel();
    var template = File.ReadAllText($@"{ AppDomain.CurrentDomain.BaseDirectory}\Areas\Start\Views\Home\RazorView1.cshtml");
    Engine.Razor.RunCompile(template, "templateName", null, model);
 ~~~

另外，他也可以設定View Config ，
~~~ cs
    ViewModel model = new ViewModel();

    var template = File.ReadAllText($@"{ AppDomain.CurrentDomain.BaseDirectory}\Areas\Start\Views\Home\RazorView1.cshtml");

    var config = new TemplateServiceConfiguration();
    //加入Razor View Config
    config.Namespaces.Add("Kendo.Mvc.UI");
    config.TemplateManager = new DelegateTemplateManager();

    var service = RazorEngineService.Create(config);

    string html = service.RunCompile(template, "templateName", null, todoModel);
~~~

RazorEngine 還有許多不一樣的設定，包含Cache 以提升效能，有興趣的朋友可以再深入研究唷！               