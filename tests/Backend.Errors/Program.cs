using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Portfolio.Api.Infrastructure;

foreach (var environment in new[] { "Production", "Development" })
{
    var builder = WebApplication.CreateBuilder(new WebApplicationOptions { EnvironmentName = environment });
    builder.WebHost.UseUrls("http://127.0.0.1:0");
    var logs = new ErrorLogs();
    builder.Logging.ClearProviders();
    builder.Logging.AddProvider(logs);
    await using var app = builder.Build();
    app.UseApiErrors();
    // Fault injection exists only in this test executable, never in the API image.
    app.MapGet("/failure", (Func<string>)(() => throw new InvalidOperationException("PRIVATE_TEST_DETAIL")));
    app.MapGet("/ok", () => "ok");
    await app.StartAsync();
    try
    {
        var address = app.Services.GetRequiredService<IServer>().Features.Get<IServerAddressesFeature>()!.Addresses.Single();
        using var client = new HttpClient { BaseAddress = new Uri(address) };
        foreach (var accept in new[] { "application/json", "text/html" })
        {
            using var request = new HttpRequestMessage(HttpMethod.Get, "/failure");
            request.Headers.Accept.ParseAdd(accept);
            using var response = await client.SendAsync(request);
            var body = await response.Content.ReadAsStringAsync();
            using var json = JsonDocument.Parse(body);
            Check(response.StatusCode == HttpStatusCode.InternalServerError, "500 expected");
            Check(response.Content.Headers.ContentType?.MediaType == "application/problem+json", "ProblemDetails content type");
            Check(json.RootElement.GetProperty("status").GetInt32() == 500, "ProblemDetails status");
            Check(json.RootElement.GetProperty("title").GetString() == "An unexpected error occurred.", "Generic title");
            Check(!string.IsNullOrWhiteSpace(json.RootElement.GetProperty("traceId").GetString()), "Correlation identifier");
            Check(!body.Contains("PRIVATE_TEST_DETAIL") && !body.Contains("InvalidOperationException") && !body.Contains("stack", StringComparison.OrdinalIgnoreCase), "No internal details");
        }
        Check(await client.GetStringAsync("/ok") == "ok", "Server remains healthy after exceptions");
        Check((await client.GetAsync("/missing")).StatusCode == HttpStatusCode.NotFound, "404 unchanged");
        Check(logs.Count == 2, "Each exception logged exactly once with its original exception");
        Console.WriteLine($"{environment}: generic 500, content negotiation, traceId, exception logs, recovery and 404 passed");
    }
    finally { await app.StopAsync(); }
}
static void Check(bool condition, string label) { if (!condition) throw new Exception(label); }

sealed class ErrorLogs : ILoggerProvider
{
    private int count;
    public int Count => count;
    public ILogger CreateLogger(string categoryName) => new Sink(this);
    public void Dispose() { }
    private sealed class Sink(ErrorLogs owner) : ILogger
    {
        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;
        public bool IsEnabled(LogLevel level) => true;
        public void Log<TState>(LogLevel level, EventId id, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
        {
            if (level == LogLevel.Error && exception?.Message == "PRIVATE_TEST_DETAIL")
                Interlocked.Increment(ref owner.count);
        }
    }
}
