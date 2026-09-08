using System.Diagnostics;

namespace Portfolio.Api.Infrastructure;

public static class ApiErrors
{
    public static IApplicationBuilder UseApiErrors(this IApplicationBuilder app) =>
        app.UseExceptionHandler(new ExceptionHandlerOptions
        {
            // Keep the framework's single exception log and diagnostics in .NET 10.
            SuppressDiagnosticsCallback = _ => false,
            ExceptionHandler = context => Results.Problem(
                statusCode: StatusCodes.Status500InternalServerError,
                title: "An unexpected error occurred.",
                extensions: new Dictionary<string, object?>
                {
                    ["traceId"] = Activity.Current?.Id ?? context.TraceIdentifier
                }).ExecuteAsync(context)
        });
}
