---
layout: articles
title: "RabbitMQ with .Net Core"
tags: [".Net Core","RabbitMQ"]
category: blog
---
## 前言

部門近期決定導入RabbitMQ取代Redis Pub/Sub,主要有以下缺點才促使我們更換
* 有掉訊息的淺在風險(致命傷)
* 監控不易
* 訊息無法持久化
剛好RabbitMQ可以解決上述問題,與部門成員討論後決定將這個技術導入到現有專案來.

<!--more-->

## 介紹

網路上很多關於RabbitMQ的介紹,這邊分別介紹幾個訊息散發(Exchange)的機制,
1. Fanout (Broadcast)
簡單來說這就是廣告公司到大樓裡將廣告傳單放到每一個信箱(Queue),所以每個信箱擁有人都會收到這個廣告.
(當然這個模式有掉訊息的風險)

2. Direct
這是郵差將掛號信放進特定的信箱內,只有有信箱鑰匙可以拿到這封信.

3. Topic
這個機制稍微特別一點,她可以自行設定一些"規則"來指定信件要放進哪一些信箱,
> 例如:"台灣台北市內湖區Harry路123號"
我們可以透過設定拆成三個信箱(也可以很多個),台灣的一個,台北市的一個,內湖區的一個,
所以當你的地址符合條件是,信件就會被送到這些信箱來.

## 開始動手作
這邊透過Docker將RabbitMQ的環境建起來,首先先建立docker-compose 檔案,
這邊要注意的是要使用"3-management"的版本,不然不會有manage的畫面唷!

~~~ yml
version: '3.1'
services:
  rabbitmq:
    image: rabbitmq:3-management
    container_name: rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: "superuser"
      RABBITMQ_DEFAULT_PASS: "pass.123"
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

~~~ bat
docker-compose up -d
~~~

![Image](https://raw.githubusercontent.com/changyuhao625/changyuhao625.github.io/master/images/blog/2019/07/rabbit-landing-page.png)