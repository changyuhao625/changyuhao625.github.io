---
layout: post
title: "[.Net Core] .Net Core 2.x Application 如何在SCM上運作!"
tags: [".Net Core","ServiceBase","Windows Service","SCM"]
category: tech
author: Harry Chang
---

## 前言

 先前在撰寫Windows背景服務的時候，
 
 通常會透過<a target="_blank" href="https://docs.microsoft.com/zh-tw/dotnet/api/system.serviceprocess.servicebase?view=netframework-4.7.2">ServiceBase</a>來讓Service Control Manager(SCM)來控制服務的停啟。
 
但在.Net Core 3.0之前，並沒有ServiceBase可以直接使用，.Net Core 2.x 該怎麼做呢?

透過一些資料發現可以透過<a target="_blank" href="https://docs.microsoft.com/zh-tw/dotnet/api/microsoft.extensions.hosting?view=aspnetcore-2.2">IHostedService</span>讓.Net Core Application 成為一個Windows Service。

我們來看看怎麼做!

<!--more-->

## 1.安裝套件

我們需要以下兩個套件:
1. Microsoft.Extensions.Hosting
2. System.ServiceProcess.ServiceController

可以透過Package Manager 執行以下Script來安裝
~~~ ps
Install-Package Microsoft.Extensions.Hosting -Version 2.2.0
Install-Package System.ServiceProcess.ServiceController -Version 4.5.0
~~~

## 2.實作IHostLifetime

我們必須要實作IHostLifetime，來模擬出Winodws Service的生命週期，

程式碼如下:

~~~cs
public class ServiceBaseLifetime : ServiceBase, IHostLifetime
{
    private readonly TaskCompletionSource<object> _delayStart = new TaskCompletionSource<object>();

    public ServiceBaseLifetime(IApplicationLifetime applicationLifetime)
    {
        ApplicationLifetime = applicationLifetime ?? throw new ArgumentNullException(nameof(applicationLifetime));
    }

    private IApplicationLifetime ApplicationLifetime { get; }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        Stop();
        return Task.CompletedTask;
    }

    public Task WaitForStartAsync(CancellationToken cancellationToken)
    {
        cancellationToken.Register(() => _delayStart.TrySetCanceled());
        ApplicationLifetime.ApplicationStopping.Register(Stop);

        new Thread(Run).Start(); // Otherwise this would block and prevent IHost.StartAsync from finishing.
        return _delayStart.Task;
    }

    // Called by base.Run when the service is ready to start.
    protected override void OnStart(string[] args)
    {
        _delayStart.TrySetResult(null);
        base.OnStart(args);
    }

    // Called by base.Stop. This may be called multiple times by service Stop, ApplicationStopping, and StopAsync.
    // That's OK because StopApplication uses a CancellationTokenSource and prevents any recursion.
    protected override void OnStop()
    {
        ApplicationLifetime.StopApplication();
        base.OnStop();
    }

    private void Run()
    {
        try
        {
            Run(this); // This blocks until the service is stopped.
            _delayStart.TrySetException(new InvalidOperationException("Stopped without starting"));
        }
        catch (Exception ex)
        {
            _delayStart.TrySetException(ex);
        }
    }
}
~~~

## 2.撰寫HostBuilder Extensions

由於HostBuilder預設的執行方式只有Consonle模式，我們需要撰寫HostBuilder的擴充方法，

來跟HostBuilder說怎麼將Application執行為Winodws Service，

可以看到程式碼裡面<span style="color:blue">UseServiceBaseLifetime</span>，

這段注入了ServiceBaseLifetime，讓程式啟動時HostBuilder可以使用我們剛剛撰寫的ServiceBaseLifetime。


~~~java
public static class ServiceBaseLifetimeHostExtensions
{
    public static Task RunAsServiceAsync(
        this IHostBuilder hostBuilder,
        CancellationToken cancellationToken = default)
    {
        return hostBuilder.UseServiceBaseLifetime().Build().RunAsync(cancellationToken);
    }

    public static IHostBuilder UseServiceBaseLifetime(this IHostBuilder hostBuilder)
    {
        return hostBuilder.ConfigureServices(
            (hostContext, services) => services.AddSingleton<IHostLifetime, ServiceBaseLifetime>());
    }
}
~~~

## 3.實作IHostedService

接下來我們要實作IHostedService，這邊就是撰寫服務主體。

~~~java
public class JobService : IHostedService
{
    public JobService()
    {
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        //服務啟動要做的事情
        //eg. Dispose IO Stream...
        return ServiceMain();
    }

    public Task ServiceMain()
    {
        //Do something what you want...
        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        //服務結束要做的事情...
        //eg. Dispose IO Stream...
        return Task.CompletedTask; ;
    }
}
~~~

## 4.主程式

程式進入點的地方主要是宣告一個HostBuilder並且注入HostedService(剛剛寫的JobService)，

這邊就是判斷是不是有偵測到中斷或是執行參數帶有"-c"，如果是就進入Console模式。

~~~java
public class Program
{
    private static async Task Main(string[] args)
    {
        var isService = !(Debugger.IsAttached || args.Contains("-c"));

        var builder = new HostBuilder()
            .ConfigureServices((hostContext, services) =>
            {
                services.AddHostedService<JobService>();
            });

        if (isService)
        {
            await builder.RunAsServiceAsync();
        }
        else
        {
            await builder.RunConsoleAsync();
        }
    }
}
~~~

## 5.註冊Windows Service

最後一個步驟當然就是將這個應用程式註冊成Windows Service。

~~~ps
sc create yourJobName binpath=yourJobPath start= auto
~~~

* yourJobName = SCM顯示的名稱

* yourJobPath = 程式進入點路徑

## 小結

以上簡單介紹.Net Core Application要如何做才能變成Windows Service讓SCM控管。

也可以參考GitHub上的<a target="_blank" href="https://github.com/changyuhao625/NetCoreRunAsWindowsService">Source Code</a>!

## 參考

[https://www.stevejgordon.co.uk/running-net-core-generic-host-applications-as-a-windows-service](https://www.stevejgordon.co.uk/running-net-core-generic-host-applications-as-a-windows-service)
