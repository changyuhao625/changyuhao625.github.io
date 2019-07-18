---
layout: articles
title: "RabbitMQ 動手做做看"
tags: [".Net","RabbitMQ","EasyNetQ"]
category: tech
author: Harry Chang
---
## 前言

部門近期決定導入RabbitMQ取代Redis Pub/Sub，主要有以下缺點才促使我們更換

* 有掉訊息的淺在風險(致命傷)
* 監控不易
* 訊息無法持久化

剛好RabbitMQ可以解決上述問題，與部門成員討論後決定將這個技術導入到現有專案來，

本篇文章將透過EasyNetQ操作RabbitMQ。

<!--more-->

## 介紹

網路上很多關於RabbitMQ的介紹，這邊分別介紹幾個訊息散發(Exchange)的機制。
1. Fanout (Broadcast)

簡單來說這就是廣告公司到大樓裡將廣告傳單放到每一個信箱(Queue)，所以每個信箱擁有人都會收到這個廣告。
(當然這個模式有掉訊息的風險)

2. Direct

這是郵差將掛號信放進特定的信箱內，只有有信箱鑰匙可以拿到這封信。

3. Topic

這個機制稍微特別一點，她可以自行設定一些"規則"來指定信件要放進哪一些信箱，

> 例如:"台灣台北市內湖區Harry路123號"

我們可以透過設定拆成三個信箱(也可以很多個)，台灣的一個，台北市的一個，內湖區的一個，

所以當你的地址符合條件是，信件就會被送到這些信箱來。

## 開始動手做

上面簡單介紹了一些RabbitMQ Exchange的機制，接下來我們來動手做做看。

###RabbitMQ 安裝

首先透過Docker將RabbitMQ的環境建起來，我們先建立docker-compose檔案，

要注意的是要使用"3-management"的版本，不然不會有manage的畫面!

(我在這邊小卡了一下，docker成功run起來卻看不到畫面)

~~~ yml
version: '3.1'
services:
  rabbitmq:
    image: rabbitmq:3-management
    container_name: rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: "superuser"
      RABBITMQ_DEFAULT_PASS: "pass。123"
    restart: always
    ports:
      - 15672:15672
      - 5672:5672
    networks:
      - esnet
networks:
  esnet:
~~~

接著執行docker-compose

~~~
docker-compose up -d
~~~

連上"http://localhost:15672" 輸入帳號密碼(superuser/pass.123)，看到以下畫面就是安裝成功。

![rabbit-landing-page](https://raw.githubusercontent.com/changyuhao625/changyuhao625.github.io/master/images/blog/2019/07/rabbit-landing-page.png "rabbitmq-landing-page"){:width="800px" height="600px"}

### RabbitMQ 設定

接著必須要在自己的帳號上面加上Virtual Host，簡單來說就是權限控管，

可以知道哪一個Virtual Host建立了那些Querue/Connection等資訊。

![rabbitmq-add-virtual-host](https://raw.githubusercontent.com/changyuhao625/changyuhao625.github.io/master/images/blog/2019/07/rabbitmq-add-virtual-host.png "rabbitmq-add-virtual-host"){:width="800px" height="600px"}

完成上述動作後我們就可以開始寫Code了!

### EasyNetQ API

EasyNetQ 是一個可以幫助我們操作RabbitMQ的套件，可以透過nuget安裝，

安裝完成後就可以開始Coding了，這邊示範一下如何透過EasyNetQ 實做 Direct 訊息散發的功能，

我們需要撰寫兩個程式Producer（訊息產生者）和Consumer（訊息消費者）。

~~~csharp
//這是Consumer
        static void Main(string[] args)
        {
            //建立連線
            var bus = RabbitHutch.CreateBus(
                "host=127.0.0.1:5672;virtualHost=TestQueue;username=superuser;password=pass.123");

            //監聽 CommandQueue
            bus.Receive<string>("CommandQueue"， (x) => { Console.WriteLine("Got the command!"); });

            Console.ReadLine();
        }
~~~

~~~csharp
//這是Producer
        static void Main(string[] args)
        {
            //建立連線
            var bus = RabbitHutch.CreateBus(
                "host=127.0.0.1:5672;virtualHost=TestQueue;username=superuser;password=pass.123");

            //發送Message 到"CommandQueue"上
            bus.Send("CommandQueue"，"Send Command");

            Console.ReadLine();
        }
~~~

分別將兩隻程式執行起來後就可以看到以下畫面囉

![easynetq-exec-result](https://raw.githubusercontent.com/changyuhao625/changyuhao625.github.io/master/images/blog/2019/07/easynetq-exec-result.png "easynetq-exec-result")

在RabbitMQ的監控畫面上也可以看到Queue的相關資訊

![rabbitmq-queue-monitor](https://raw.githubusercontent.com/changyuhao625/changyuhao625.github.io/master/images/blog/2019/07/rabbitmq-queue-monitor.png "rabbitmq-queue-monitor")


## 小結
以上是RabbitMQ簡單的介紹，可以發現透過EasyNetQ與RabbitMQ溝通是相當的簡單與方便，

本篇文章只是最一個最簡單的示範與介紹，陸續會再補上更深入的實做。

## 參考
[https://blog.csdn.net/chendaoqiu/article/details/48440633](https://blog.csdn.net/chendaoqiu/article/details/48440633)
