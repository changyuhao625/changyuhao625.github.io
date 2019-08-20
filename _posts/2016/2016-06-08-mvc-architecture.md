---
layout: post
title: "[Asp .Net MVC] 淺談MVC系統架構"
tags: ["Asp .Net MVC"]
category: tech
author: Harry Chang
---

最近剛好有機會跨部門參與系統架構的討論， 碰到把ViewModel 傳進「商業邏輯層」的現象，

藉此機會把MVC 的系統架構釐清清楚，避免後續再有類似情形的發生，

也會順便探討不傳進去的「好處」有哪些！

 <!--more-->


首先我們必須釐清兩樣東西「ViewModel」&「DTO (Data Transform Object)」，

簡單來說ViewModel 只是呈現畫面資料的模型，可能會涵蓋一些行為；DTO則是複合的資料結構，並不會有行為存在，比較像多個Table 的集合體。

很像有點玄，不懂也沒關係，網路上也還有很多解釋可以參考。簡而言之就是不要把ViewModel 傳進商業邏輯層！

所以在不把ViewModel 傳進商業邏輯層的這個前提下，

我們的系統架構會長得跟下面這張圖很像，當然有些專案或者產品在其他考量下，可能會多切其他層，

藍色區塊從左自右，從上而下，依序是檢視、控制器、商業邏輯層、資料存取層，

黃色區塊分為三種ViewModel、DTO與Entity，

可以注意到Controller接到ViewModel 的時候再進商業邏輯層之前就會先行轉換成DTO 或是 Entity，

轉換的方法我們是使用AutoMapper當然應該還會有其他工具可以使用。

![](https://az787680.vo.msecnd.net/user/harry/b56e45e3-7053-4660-b8b8-73b4cab2f8bb/1465355595_78716.png)

接下來我們來談談好處有哪些：

1.  單元測試

    1.  我們若是有掌握ViewModel不傳進商業邏輯層的這個原則的話，在做單元測試時就會很方便，我們就不需再考量到ViewModel 所具備的行為，直接new 一個DTO起來就可以開始測試商業邏輯。

2.  商業邏輯層的重複使用性

    1.  若是我們把ViewModel 傳進商業邏輯，哪天我們想要做個手機版APP 或者是View 要大改造，因為我們把ViewModel 傳進商業邏輯層，因此我們換View 就會進而影響到商業邏輯層，就會造成我們在重複利用商業邏輯時上有些阻礙；反之，若是我們把握ViewModel 不傳進商業邏輯層的原則，那我們就可以很輕易地重複使用商業邏輯層！

後續會再找機會把ViewModel & DTO 講得更清楚，若有講錯的地方或是建議，歡迎大家留言！