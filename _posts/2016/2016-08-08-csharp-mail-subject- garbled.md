---
layout: post
title: "[SMTP] 郵件主旨亂碼！"
tags: ["C#","SMTP"]
category: tech
author: Harry Chang
---

今天發現一個 bug 為郵件主旨(附件)在某些情形下變成亂碼，查了一下資料，發現是.Net Framework 4的 bug 而且是個陳年 bug 呀，發生的原因為字串含有非 ASCII 編碼的字元，且長度又超過 41 個 UTF-8 Encode Bytes 時，就會被重複Encode兩次，導致顯示成亂碼。

解決方案有安裝微軟的Hotfix或升級，當然今天不是要介紹這個方法，而是在無法升級的情形下該如何解決？

 <!--more-->

其實很簡單，如下：
~~~ cs
                //先行轉成Base 64
                string subject = Convert.ToBase64String(Encoding.UTF8.GetBytes(currentSubject));
                MailMessage MailMessage = new MailMessage()
                {
                    BodyEncoding = Encoding.GetEncoding("UTF-8"),
                    SubjectEncoding = System.Text.Encoding.UTF8,
                    From = new MailAddress(_strSenderMail, _strSenderName, System.Text.Encoding.GetEncoding("UTF-8")),//New MailAddress(strFromEmail, strFromName, System.Text.Encoding.GetEncoding("UTF-8"))
                    //=?{語系}?{編碼方式}?{編碼後內容}?=
                    //B 表示是使用 Base64 編碼
                    //Q 表示 QP 編碼
                    Subject = string.Format("=?utf-8?B?{0}?=", subject),
                    Body = JMailObject.Body.Value.ToString(),
                    IsBodyHtml = _isHTMLFormat
                };
~~~

只需要先行將主旨轉為Base64，並指定語系、編碼方式及編碼後的內容，即可解決此問題。

參考：

[https://support.microsoft.com/en-us/kb/2402064](https://support.microsoft.com/en-us/kb/2402064)

[System.Web.Mail 主旨會亂碼，要如何將主旨轉成"Base64 "](http://www.blueshop.com.tw/board/FUM20041006161839LRJ/BRD2008012910471081Q.html)