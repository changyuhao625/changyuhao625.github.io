---
layout: post
title: "[C#] Null 條件運算子(Null Conditional Operators)"
tags: ["C#"]
category: tech
author: Harry Chang
---

今天在同仁的Code裡面看到陌生的運算子，如下：

~~~ cs
private string GetCustomerDetail(Customer customer)
        {
            var id = customer?.Id ?? "123456";
　　　　　　　//ToDo....
        }
~~~

<p>先不管這個Method的用處,看內容會發現「<span style="color:#0000FF;">?.</span>」「<span style="color:#0000FF;">??</span>」這些運算子是什麼用處呢?</p>


<!--more-->

原來這個運算子的用法是用來判斷物件是否為空，若不為空進一步去判斷物件內的Property是否為空,若其中一個為空,則會回傳「??」後的值，

簡單來說就是下面這段Code的精簡版:
~~~ cs
        private void GetCustomerDetail(Customer customer)
        {
            string id;
            if (customer == null || customer.Id == null)
            {
                id = "123456";
            }
        }
~~~

透過Null 條件運算子，我們可以把上面這段Code 精簡成一行，以後大家有類似的判斷不妨試試這樣的用法。

參考：
[Null 條件運算子 (C# 和 Visual Basic)](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/operators/null-conditional-operators)