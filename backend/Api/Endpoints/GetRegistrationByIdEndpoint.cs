
using Api.Extensions;
using Application.Features.Registration.GetRegistrationById;
using Microsoft.AspNetCore.Routing;

namespace Api.Endpoints;

public static class GetRegistrationByIdEndpoint
{
    public static IEndpointRouteBuilder MapGetRegistrationByIdEndpoint(
        this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/registrations/{id:guid}", async (
            Guid id,
            GetRegistrationByIdHandler handler,
            CancellationToken cancellationToken) =>
        {
            var query = new GetRegistrationByIdQuery(id);

            var result = await handler.HandleAsync(
                query,
                cancellationToken);

            if (!result.IsSuccess)
            {
                return result.ToProblemDetails();
            }

            return Results.Ok(result.Value);
        });

        return app;
    }
}
