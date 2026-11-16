
using Application.Features.Registration.GetRegistrations;
using Domain.Enums;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

namespace Api.Endpoints;

public static class GetRegistrationsEndpoint
{
    public static IEndpointRouteBuilder MapGetRegistrationsEndpoint(
        this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/registrations", async (
            GetRegistrationsHandler handler,
            IValidator<GetRegistrationsQuery> validator,
            CancellationToken cancellationToken,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? type = null,
            [FromQuery] string? status = null,
            [FromQuery] string? participantName = null) =>
        {
            RegistrationType? registrationType = null;
            RegistrationStatus? registrationStatus = null;

            if (!string.IsNullOrWhiteSpace(type))
            {
                if (!Enum.TryParse<RegistrationType>(
                        type, true, out var parsedType) ||
                    !Enum.IsDefined(parsedType) ||
                    !Enum.GetNames<RegistrationType>().Any(name =>
                        string.Equals(name, type, StringComparison.OrdinalIgnoreCase)))
                {
                    return Results.ValidationProblem(
                        new Dictionary<string, string[]>
                        {
                            ["Type"] = ["Invalid registration type."]
                        });
                }

                registrationType = parsedType;
            }

            if (!string.IsNullOrWhiteSpace(status))
            {
                if (!Enum.TryParse<RegistrationStatus>(
                        status, true, out var parsedStatus) ||
                    !Enum.IsDefined(parsedStatus) ||
                    !Enum.GetNames<RegistrationStatus>().Any(name =>
                        string.Equals(name, status, StringComparison.OrdinalIgnoreCase)))
                {
                    return Results.ValidationProblem(
                        new Dictionary<string, string[]>
                        {
                            ["Status"] = ["Invalid registration status."]
                        });
                }

                registrationStatus = parsedStatus;
            }

            var query = new GetRegistrationsQuery(
                page,
                pageSize,
                registrationType,
                registrationStatus,
                participantName);

            var validation = await validator.ValidateAsync(
                query,
                cancellationToken);

            if (!validation.IsValid)
            {
                return Results.ValidationProblem(
                    validation.ToDictionary());
            }

            var result = await handler.HandleAsync(
                query,
                cancellationToken);

            return Results.Ok(result);
        });

        return app;
    }
}
