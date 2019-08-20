---
layout: post
title: "[Asp .Net MVC] 使用ValidateAntiForgeryToken FilterAttribute 防範CSRF攻擊!"
tags: ["Asp .Net MVC"]
category: tech
author: Harry Chang
---

CSRF(Cross Site Request Forgery) 是一種駭客常用手段，網路上可以找到許多解釋，這邊就不再詳述，

這篇文章主要是在說明如何使用「AntiForgeryToken」以及「ValidateAntiForgeryToken」來防範CSRF，

另外也會說明，在不使用Form Submit 的情形下，該如何驗證AntiForgeryToken。

 <!--more-->

Html Helper本身有提供 Ajax.BeginForm的方法，讓開發人員可以快速地透過Submit 來將表單資料回傳，

所以程式碼大概會長得跟下面這段Code有點類似：

~~~ cs 
    @using (Ajax.BeginForm("Send", "Apply",
                        new AjaxOptions()
                        {
                            HttpMethod = "POST",
                            UpdateTargetId = "UpdateTargetId",
                            InsertionMode = InsertionMode.Replace,
                            OnBegin = "CheckContent",
                            OnSuccess = "OnSuccess"
                        }
                        ))
    {
        if (!ViewData.ModelState.IsValid)
        {
            @Html.ValidationSummary(false, "", new { @style = "color:red;" })
        }

        //防偽基元(簡單來說就是防止被駭客偽造的鑰匙)
        @Html.AntiForgeryToken()
~~~

我們透過Form 內的Submit ，會自動幫我們把AntiForgeryToken一起傳送回來，

![](https://az787680.vo.msecnd.net/user/harry/460952a4-a3d5-4332-8ea2-acba7c7495f5/1462500113_76306.png)而只要Controller 內有掛 「<span style="color:#00cc66;">ValidateAntiForgeryToken</span>」這個FilterAttribute，

就會自動幫我們驗證防偽基元是否正確（簡單就是對的鑰匙才能開門）。

~~~ cs 
    [HttpPost]
    //驗證防偽基元
    [ValidateAntiForgeryToken]
    public ActionResult Send()
    {
      return View();
    }
~~~

若是我們要透過jQuery 「ajax」 的方式，如何讓我們通過防偽基元的驗證 ?

其實很簡單，只需要再回傳的data 內，把防偽基元的值回傳，即可順利通過。

~~~ javascript
        $.ajax({
                        url: '../xxx/Apply/Send',
                        type: "POST",
                        data:AddAntiForgeryToken({}),
                        dataType: 'text',
                        success: function (r) {
                        }
                    });
~~~

~~~ javascript
    AddAntiForgeryToken = function (data) {
        if ($.isEmptyObject(data)) {
            data = {};
        }
        //回傳防偽基元得值
        data.__RequestVerificationToken = $('input[name=__RequestVerificationToken]').val();
        return data;
    }
~~~

參考連結：

### [ASP.NET MVC - ValidateAntiForgeryToken 與 自定 HandleError 處理顯示客製的錯誤訊息頁](http://kevintsengtw.blogspot.tw/2013/01/aspnet-mvc-validateantiforgerytoken.html)