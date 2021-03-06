---
layout: post
title: "[Web API 2] 客製化ModelBinder"
tags: ["Model Binding","ModelBinder"]
category: tech
author: Harry Chang
---

產品API在模型細節(Model Binding)上有特別的需求，因此必須自行客製化模型細節的方式，

網路上有非常多資源在講述如何客製化，個人比較推薦這篇「[Parameter Binding in ASP.NET Web API​](https://docs.microsoft.com/en-us/aspnet/web-api/overview/formats-and-model-binding/parameter-binding-in-aspnet-web-api)」，

詳細作法這邊不再重述，今天要談的是在實作ModelBinder 碰到的問題。
<!--more-->

首先我依照範例，實作了一模一樣的類別如下，

~~~cs
    public class BaseBinder : IModelBinder
        {
            public bool BindModel(HttpActionContext actionContext, ModelBindingContext bindingContext)
            {
                throw new NotImplementedException();
            }
        }
~~~

並且新增了一個TestMode，並透過屬性宣告的方式，宣告他必須使用BaseBinder 來進行模型細節，

~~~cs
        [ModelBinder(typeof(BaseBinder))]
        public class TestModel
        {
            public string testProperty { get; set; }
        }
~~~

一模一樣的Code Run起來卻有錯誤，訊息如下：

<span style="color:#FF0000;">*'System.InvalidOperationException' 類型的例外狀況發生於 System.Web.Http.dll，但使用者程式碼未加以處理 其他資訊: 無法從 'BaseBinder' 建立 'IModelBinder'。請確定它衍生自 'IModelBinder'，並且有公用無參數建構函式。*</span>

怎麼看這個錯誤訊息都覺得怪，我確實有實作「IModelBinder」，但為何拋出這個錯誤訊息？仔細揣摩一番發現using出了問題！

首先，我們必須要知道 MVC 跟 API 雖然底層非常類似，但其實是不同的元件在運作，前者是「System.Web.Mvc」後者是「System.Web.Http」，功能十分相似，只差別再NameSpace 不一樣，而我的TestModel using 了「System.Web.Mvc」，但BaseBinder 是實作「System.Web.Http」的IModelBinder，就發生了衝突，近一步產生了上述的錯誤訊息。

值得注意的是，我可以正常編譯過，所以兩個元件的基底類別應該是同一個，也可能是因為這個原因微軟在 MVC 6 之後就合併了這兩個元件([Top 10 Changes in ASP.NET 5 and MVC 6](http://stephenwalther.com/archive/2015/02/24/top-10-changes-in-asp-net-5-and-mvc-6))，以避免我現在出現的這個問題。

總之在MVC 6 之前大家還是要特別小心，不要錯誤引用這兩個元件。