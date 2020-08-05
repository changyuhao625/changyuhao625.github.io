---
layout: post
title: "[Azure]Dotnet Core 3 Log With Application Insights"
tags: ["dotnet core 3","Azure","Application Insights"]
category: tech
author: Harry Chang
---
## 前言

Application Insights 是微軟推出已久的監控服務，提供強大的分析工具協助診斷系統問題，

只許要在應用程式安裝SDK，簡單設定後即可使用。

先前大多碰到的情境都是將log寫到實體檔案，再透過filebeat 將log 送進elasticsearch，

最後透過Kibana視覺化資料，這種做法有以下兩個缺點。

  * 額外Resource成本
  * 需要額外設計log style，以利我們Trace Issue

Application Insights 幫我們解決掉上述的問題，

第一他成本非常低廉，你不需要再額外架設一台機器來做Log蒐集與監控，

第二Application Insights 完美的與微軟生態系整合(Asp.Net, Asp.Net Core)，

所以我們不需要做任何的設定Application Insights 可以無痛(額外Coding)監控許多資訊，

Ex:
  1. Performance Counter
  2. 跨元件診斷(DB,3rd Service...)
  3. 應用程式與其他外部系統的對應（頻率,處理時間...)

也是因為擁有以上那麼多的優點，我們決定將這項產品導入到我們的系統中，

也就回到了該如何把我們的Log記錄到Application Insights呢？

<!--more-->

## Configuration

首先你需要在Azure上面新增一個Application Insights的Resource（這邊就不講解這段操作），

再來就是針對你得專案進行設定，

如果你是使用Visual Studio 只需要在專案上新增「Application Insights Telemetry」，

接下來按著指示設定你就完成第一部份得設定，

如果你是使用Vs Code, Rider...這類的IDE你就需要手動進行一些設定，

1. 安裝「Microsoft.ApplicationInsights.AspNetCore」
2. 在Startup ConfigureServices裡，加入一段程式碼
~~~csharp
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddApplicationInsightsTelemetry();
        }
~~~

3. 你的appsettings.json上設定你的Instrumentation Key (這個Key可以在Application Insights的概觀上找到)
~~~json
{
  "ApplicationInsights": {
    "InstrumentationKey": "your Instrumentation Key"
  }
}
~~~
當然你也可以不要在appsetting.json設定這個Key也可以直接在ConfigureServices時設定
~~~csharp
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddApplicationInsightsTelemetry("your Instrumentation Key");
        }
~~~

## 開始測試

簡單寫一下各層級的Log看一下Application Insights收不收得到。
~~~csharp
    [Route("api/[controller]")]
    [ApiController]
    public class LogController : ControllerBase
    {
        private readonly ILogger<LogController> _logger;

        public LogController(ILogger<LogController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        [Route("LogTest")]
        public IActionResult LogTest()
        {
            _logger.LogDebug("Debug!");
            _logger.LogInformation("Information!");
            _logger.LogWarning("Warning!");
            _logger.LogError("Error!");
            _logger.LogCritical("Critical!");
            return Ok();
        }
    }
~~~

但Application Insights 上只看得到Warning以上的Log，
![application-insights-record](https://raw.githubusercontent.com/changyuhao625/changyuhao625.github.io/master/images/blog/2020/08/application-insights-record.png "application-insights-record"){:width="800px" height="600px"}

dotnet core 預設只記錄warning等級以上的訊息，若需要紀錄其他層級，則需要在ConfigureLogging做一些調整，

~~~csharp
  public static IHostBuilder CreateHostBuilder(string[] args)
        {
            return Host.CreateDefaultBuilder(args)
                .UseContentRoot(Directory.GetCurrentDirectory())
                .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); })
                .ConfigureLogging(logger =>
                {
                    logger.AddFilter<ApplicationInsightsLoggerProvider>("your name space",
                        LogLevel.Information);
                });
        }
~~~


調整完就可以順利在Application Insights上看到完整的Log。



## 注意事項
如果你得專案一開始有使用Serilog,Nlog...等LogProvider，會出現怎麼樣也無法出現在Application Insights上的問題，
簡單的處理方式是移除這些套件的依賴，但如果真的需要這些套件的一些功能，如：template,expression等，
就要另外針對該套件進行額外的設定，以Serilog來說必須安裝<a target="_blank" href="https://github.com/serilog/serilog-sinks-applicationinsights">Serilog.Sinks.ApplicationInsights</a>
有機會我們再來試試看。

## 參考
[https://gavilan.blog/2020/01/29/asp-net-core-3-1-using-application-insights-to-save-logs/](https://gavilan.blog/2020/01/29/asp-net-core-3-1-using-application-insights-to-save-logs/)
