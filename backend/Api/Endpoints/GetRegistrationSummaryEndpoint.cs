
using Application.Features.Registration.GetRegistrationSummary;
using Microsoft.AspNetCore.Routing;

namespace Api.Endpoints;

public static class GetRegistrationSummaryEndpoint
{
    public static IEndpointRouteBuilder MapGetRegistrationSummaryEndpoint(
        this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/registrations/summary", async (
            GetRegistrationSummaryHandler handler,
            CancellationToken cancellationToken) =>
        {
            var query = new GetRegistrationSummaryQuery();

            var result = await handler.HandleAsync(
                query,
                cancellationToken);

            return Results.Ok(result);
        });

        return app;
    }
}
