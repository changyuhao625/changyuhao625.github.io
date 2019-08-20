---
layout: post
title: "[jQuery] Global Ajax Event Handlers"
tags: ["jQuery"]
category: tech
author: Harry Chang
---

先前產品自行封裝 Ajax 並實作 Ajax 送出後block UI，當然封裝有他一定的好處，

但是萬一今天我不想用封裝的元件時，我又想要block UI時，寫法就會很麻煩。  

可能變成會這樣寫：

 <!--more-->

~~~ javascript
           $.blockUI(LoadingOptions); 
           $.ajax({
                url: url,
                data: data,
                type: "POST",
                success: function (r) {
                 //Do Something...            
                 $.unblockUI();
                },
                error: function () {
                    $.unblockUI();
                }
            });
~~~

今天分享Global Ajax Event Handlers，寫起來更簡單且直覺，程式碼如下：

~~~ javascript
         //Ajax 開始後，要做的事情
        $(document).ajaxStart(function () {
            $.blockUI(LoadingOptions);
        });
        //Ajax 結束後，要做的事情
        $(document).ajaxStop(function () {
            $.unblockUI();
        });
        //Ajax 發生例外時，要做的事情
        $(document).ajaxError(function () {
            $.unblockUI();
        });
~~~

這些用法就可以把一些共用邏輯寫在這些事件裡面，進一步達到「關注點分離」的目標，即我只需要專注在該次 Ajax 動作的邏輯，而不需要去想 block UI的事情了。

最後 Global Ajax Event Handlers 總共有六個 「ajaxStart」、「ajaxSend」、「ajaxSuccess」、「ajaxError」、「ajaxComplete」與「ajaxStop」；

lifecycle 為** ajaxStart > ajaxSend > ajaxSuccess / ajaxError > ajaxComplete > ajaxStop **，可以根據其特性做不一樣的應用。

參考：

[Category: Global Ajax Event Handlers](http:// https://api.jquery.com/category/ajax/global-ajax-event-handlers/)