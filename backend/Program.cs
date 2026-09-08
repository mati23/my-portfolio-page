using Prometheus;

// Probe with the installed runtime; no external HTTP client is required.
if (args is ["--health-check"])
{
    using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(2) };
    try
    {
        using var response = await client.GetAsync("http://127.0.0.1:5126/health");
        Environment.Exit(response.IsSuccessStatusCode ? 0 : 1);
    }
    catch (HttpRequestException) { Environment.Exit(1); }
    catch (TaskCanceledException) { Environment.Exit(1); }
    return;
}

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHealthChecks();

// A semicolon-separated value lets environment overrides replace the entire allowlist.
var origins = (builder.Configuration["Cors:AllowedOrigins"] ?? "")
    .Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
foreach (var origin in origins)
{
    if (!Uri.TryCreate(origin, UriKind.Absolute, out var uri) ||
        (uri.Scheme != "http" && uri.Scheme != "https") ||
        uri.Authority.Contains('*') || origin != uri.GetLeftPart(UriPartial.Authority))
        throw new InvalidOperationException("Cors:AllowedOrigins must contain HTTP(S) origins without paths or trailing slashes.");
}
builder.Services.AddCors(options => options.AddPolicy("AllowFrontend", policy =>
    policy.WithOrigins(origins).AllowAnyMethod().AllowAnyHeader()));

var redirectHttps = builder.Configuration.GetValue<bool>("HttpsRedirection:Enabled");
if (redirectHttps)
{
    var port = builder.Configuration.GetValue<int?>("HttpsRedirection:Port");
    if (port is null or < 1 or > 65535)
        throw new InvalidOperationException("HttpsRedirection:Port must be set to a valid HTTPS listener port.");
    builder.Services.AddHttpsRedirection(options => options.HttpsPort = port);
}

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Health probes remain HTTP inside the container; TLS terminates at the ingress.
app.UseHealthChecks("/health");

// A separate, unpublished port keeps metrics out of the public API.
// Check the actual socket, not the caller-controlled Host header.
app.Use(async (context, next) =>
{
    if (context.Request.Path.StartsWithSegments("/metrics") &&
        context.Connection.LocalPort != 9464 &&
        !(app.Environment.IsDevelopment() &&
          context.Connection.RemoteIpAddress is { } address &&
          System.Net.IPAddress.IsLoopback(address)))
    {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        return;
    }
    await next(context);
});
app.UseMetricServer("/metrics");
app.UseHttpMetrics();

app.UseCors("AllowFrontend");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Production TLS is terminated at the ingress. Direct HTTPS is explicitly opt-in.
if (redirectHttps) app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
