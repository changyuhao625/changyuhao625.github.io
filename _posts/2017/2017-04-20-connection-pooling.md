---
layout: post
title: "[Asp.Net] Connection Pooling"
tags: ["Asp.Net"]
category: tech
author: Harry Chang
---

最近系統時不時就出現「<span style="color:#FF0000;">*已超過連接逾時的設定。在取得集區連接之前超過逾時等待的時間，可能的原因為所有的共用連接已在使用中，並已達共用集區大小的最大值。*</span>」的錯誤訊息。

在協助解決時，發現有關於Connection Pooling觀念不是了解得很透徹，於是想藉由這篇詳述一下Connection Pooling的運作！

<!--more-->

一般來說，我們再透過SqlConnection 開啟一個連接閘道的時候，會類似以下的做法，

~~~cs
    using (SqlConnection conn = new SqlConnection("your connection string"))
    {
       conn.Open();
       //...Do Something you want
    }
~~~

我們會使用「[Using好寫法](https://dotblogs.com.tw/harry/2016/07/14/113255)」來控管資源，我們以為出了Using之後，這個Connection 就會被正常回收，

但實際上並非如此，由於建立起一個連線閘道是非常消耗資源的，也因此.Net 本身有一個 <span style="color:#0000FF;">Connection Pooling </span>的機制來控管我們所建立起的Connection，

當我們Dipose Connection 後，實際上會搬到Connection Pool 裡面，若又有人要使用相同的連線，Connection Pool 就會把我們剛剛Dipose 的Connection再交給下一個人使用，

若一直沒有人要使用，約莫過4-8分鐘後，就會真的把這個連線給釋放掉，透過<span style="color:#0000FF;">Connection Pooling </span>的機制，我們可以大幅的增加Connection的使用率，也可以降低啟動一個新的Connection 消耗資源的頻率。

當你沒有使用「[Using好寫法](https://dotblogs.com.tw/harry/2016/07/14/113255)」或是正常的釋放資源，就會有越來越多的Connection 被啟動，又或是同一個時間突然爆量的連線進來，都有可能造成Connection Pool 爆滿而出現「<span style="color:#FF0000;">*已超過連接逾時的設定。在取得集區連接之前超過逾時等待的時間，可能的原因為所有的共用連接已在使用中，並已達共用集區大小的最大值。*</span>」的錯誤訊息。

在碰到這個問題時，可以先看看下面幾點是否有發生在自己的系統上

1.  檢查「是否沒有使用[Using好寫法](https://dotblogs.com.tw/harry/2016/07/14/113255)或是連線沒有被正常關閉」，如果有養成好習慣，就可以跳過這個步驟，
2.  確認Pool Size 是否符合使用，預設的大小為100，若不符合使用可以調高一些。
3.  檢查Connection Lifetime 是否有被設定，預設是0，如果有被調整，就要看看是不是設太長了導致來不及釋放掉。

或許問題就可以迎刃而解唷！

若需要觀察Connection Pool 的使用情形，也可以參考亂馬克的文章唷「[https://dotblogs.com.tw/rainmaker/2017/04/26/143316](https://dotblogs.com.tw/rainmaker/2017/04/26/143316)」

參考：

[http://huan-lin.blogspot.com/2012/05/net-connection-pool.html](http://huan-lin.blogspot.com/2012/05/net-connection-pool.html)

[https://msdn.microsoft.com/en-us/library/8xx3tyca(v=vs.100).aspx](https://msdn.microsoft.com/en-us/library/8xx3tyca(v=vs.100).aspx)

[https://msdn.microsoft.com/zh-tw/library/system.data.sqlclient.sqlconnection.connectionstring(v=vs.110).aspx](https://msdn.microsoft.com/zh-tw/library/system.data.sqlclient.sqlconnection.connectionstring(v=vs.110).aspx)git                 