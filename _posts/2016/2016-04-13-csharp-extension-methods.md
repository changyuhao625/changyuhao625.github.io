---
layout: post
title: "[C#] 擴充方法(Extension Methods)!"
tags: ["C#"]
category: tech
author: Harry Chang
---

C# 擴充方法(Extension Methods) ，C# 3.0 的「新」功能，其實也不新了畢竟C# 6.0都要出了。「擴充方法」顧名思義在原生類別擴充新的方法出來供人使用。

 <!--more-->

我們常使用的String 類別的其中有一個方法為Trim()，這個方法為去掉字串內前後的空白，

~~~ cs 
string tempString=" Word ".Trim();
~~~

若我們想要有一個新的方法如「String 轉成 Int」，該如何時做呢？

當然很多人會使用Convert.ToInt32() 的方法：

~~~ cs 
    string intStr = "1234567";
    var tempInt = Convert.ToInt32(intStr);
~~~

當然這個方法不好，若是字串無法被轉成int 會拋錯誤。

又或者是保險一點的方法 int.TryParse()：

 ~~~ cs 
    string intStr = "1234567";
    int tempInt = 0;
    int.TryParse(intStr, out tempInt);
~~~

但看起來又太過冗長。且若專案上很常使用這種轉換的話，重複的Code 會相當多，

維護起來也不太容易，若是使用擴充方法，我們在程式碼上面看起來會相當簡潔，

以下介紹作法：

~~~ cs 
    public static int ToInt(this string str)
    {
       int tempInt = 0;
       int.TryParse(str, out tempInt);
       return tempInt;
    }
~~~

我們撰寫一個「<span style="color:#0000FF;">靜態( static )</span>」的方法ToInt()，回傳值型態為 int，傳入值型態為 String ，

特別的是我們在串入值型態前面加入了一個 「<span style="color:#0000FF;">this</span>」，這個意思就是我要對String 這個類別做「擴充方法」，

方法內容就很簡單了，單純的String 轉 int ，

完成後使用方法就超簡單啦，

~~~ cs 
"12345".ToInt();
~~~

是不是看起來超簡潔的！！

參考：

[https://msdn.microsoft.com/zh-tw/library/bb383977.aspx](https://msdn.microsoft.com/zh-tw/library/bb383977.aspx)

                