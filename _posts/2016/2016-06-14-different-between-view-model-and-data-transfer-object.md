---
layout: post
title: "[Asp .Net MVC] ViewMode vs DTO(Data Transfer Object)"
tags: ["View Model","DTO"]
category: tech
author: Harry Chang
---

View Model 與 DTO 到底有何不同的時候，想用這篇文章解釋一下差異。

簡單來說View Model 是一個 POCO 物件，一個POCO 物件可以包含以下行為：

1.  保留狀態(State)。
2.  具有行為(資料驗證...)

最重要的就是具有行為，我們在做前端畫面時，很常透過Data Annotation 的方式，來驗證前端傳來的資料是否符合我們的定義，

 <!--more-->

~~~ cs
        public class ViewModel
        {
            /// <summary>
            /// UsrId 必填
            /// </summary>
            [Required]
            public string UsrId { get; set; }

            [EmailAddress(ErrorMessage = "您的Email 格式異常!")]
            public string Email { get; set; }

            /// <summary>
            /// 申請日期
            /// </summary>
            private DateTime _applyDate;
            public DateTime ApplyDate
            {
                get
                {
                    //預設值帶今天
                    if (_applyDate == default(DateTime))
                    {
                        _applyDate = DateTime.Now;
                    }
                    return _applyDate;
                }
                set
                {
                    _applyDate = value;
                }
            }

        }
~~~

各位可以看到上面這個View Model ，UsrId 一定要必填、Email 格式一定要正確、申請日期預設帶今日，這些都是我們定義好的前端行為。

那DTO 又是什麼呢？

DTO（Data Trasfer Object）我認為翻成「資料乘載物件」較為合適，即這個物件只是一條船，這條船只負責幫我把貨物送到我們想要的地點，

但不會幫我們確認貨物是否違法、有無過期（因為這些工作是POCO 物件的工作）。

* * *

當然，有時我們沒有在View Model 做一些行為時，這時候View Model 就會跟 DTO 長得一模一樣，

這也是為何很多新人無法理解為何要將這兩樣東西區分開來（因為還要多維護好幾個檔案）；

另外一個要區分的原因，是因為我們並不想把這些行為帶到商業邏輯層或是資料存取層來，

因為View 隨時都有可能變動，一變動我們一定會異動Model ，異動Model 近一步就會影響到我們的商業邏輯層跟資料存取層，這樣整個程式架構的耦合性就會變得很高！

另外一些分開的好處可以參考「[[Asp .Net MVC] 淺談MVC系統架構](https://changyuhao625.github.io/tech/2016/06/08/mvc-architecture)」