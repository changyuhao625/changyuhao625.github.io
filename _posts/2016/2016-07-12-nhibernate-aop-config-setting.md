---
layout: post
title: "[Spring.Net] Aop NHibernate Transaction失效了！"
tags: ["Spring.Net","NHibernate"]
category: tech
author: Harry Chang
---

今天產品發現NHibernate Session Update 失效了，查了很久發現是我們在Service Layer 的 Aop Transaction 失效了，

導致Load 出來的物件沒有被掛上Proxy ，進一步影響NHibernate 無法監控物件是否有被異動。

 <!--more-->

首先合理懷疑是Aop Pattern 有問題，檢查一下XML檔，

~~~ xml
<object id="ServiceOperation" type="Spring.Aop.Support.SdkRegularExpressionMethodPointcut, Spring.Aop">
        <property name="pattern" value="Product.Domain.*.Service" />
        <property name="pattern" value="Product.Domain.Module1.*.Service" />
        <property name="pattern" value="Product.Domain.Module2.*.Service" />
      </object>
~~~

看起來很正常，仔細測試一下，發現只有在最後一個Module2 Aop才會正常，合理懷疑是下蓋上導致最後一個才有用，

查了一下多個Pattern<span style="color:#FF0000;">s</span> (複數+S)應該使用以下寫法，Aop 就會正常了！

~~~ xml
 <object id="ServiceOperation" type="Spring.Aop.Support.SdkRegularExpressionMethodPointcut, Spring.Aop">
        <property name="patterns">
          <list>
            <value>Product.Domain.*.Service</value>
            <value>Product.Domain.Module1.*.Service</value>
            <value>Product.Domain.Module2.*.Service</value>
          </list>
        </property>
      </object>
~~~

延伸閱讀：[[NHibernate] Session Update 奇怪的寫法](https://dotblogs.com.tw/harry/2016/07/12/145523)

參考：[12. Spring AOP APIs](http://docs.spring.io/spring/docs/current/spring-framework-reference/html/aop-api.html)

                