---
layout: post
title: "[LINQ] 增加可讀性的好寫法!"
tags: ["C#","LINQ"]
category: tech
author: Harry Chang
---

今天幫同仁 Code Review 發現他寫了一段雙層迴圈，但是其實可以用一段 LINQ 就解決掉，如下：

前情提要：

系統有數種的辦理方式，這裡簡稱A、B、C 與 D，同一時間點同一個單號可以做複數個辦理方式，並且把做過的辦理方式以字串方式儲存，

例如做過「A 與 C」那DB會存 “A, B”，到前端來在用Split的方式來看剛單號做哪哪些辦理。

 <!--more-->

因此同事先宣告了一個 List<string> HandleWays，儲存所有的辦理方式，

~~~cs
List<string> HandleWays=new List<string>(){"A","B","C","D"};
~~~

接著從DB撈出了該單號做過的辦理方式，

~~~cs
var CaseHandles = this.Load("辦理編號").HandleWays.Split(',');
~~~

接下來進入正題，同仁使用雙層迴圈來判斷是否有做過該件事情(這邊很弔詭，其實根本不用這樣做，Load 出來就可以直接丟出去了，但是我當下也沒想那麼多，看到雙層迴圈直覺可以改成 LINQ 寫法，因此這邊部探討使用雙層迴圈的邏輯)，
~~~cs
                var result = new List<string>();
                foreach (var caseHandle in CaseHandles)
                {
                    foreach (string handleWay in HandleWays)
                    {
                        if (handleValue == caseHandle)
                        {
                            result.Add(handleValue);
                        }
                    }
                }
~~~

但其實一行 LINQ 就可以解決了

~~~cs
var data = (from p in HandleWays where CaseHandles.Contains(p) select p).ToList();
~~~

以上可以透過 LINQ 的特性快速的解決我們的需求，更大幅增加了可讀性，是不是很棒呢？

後記：

感謝Demo分享如何使用Lambda讓寫法更為簡潔，如下：

~~~cs
var data=HandleWays.Where(d=>CaseHandles.Contains(d)).ToList();
~~~              