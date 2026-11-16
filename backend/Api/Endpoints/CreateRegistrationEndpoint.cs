
using Api.Filters;
using Application.Abstractions.Data;
using Application.Features.Registration.CreateRegistration;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;

namespace Api.Endpoints;

public static class CreateRegistrationEndpoint
{
    public static IEndpointRouteBuilder MapCreateRegistrationEndpoint(
        this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/registrations", async (
            CreateRegistrationCommand command,
            CreateRegistrationHandler handler,
            IAppDbContext dbContext,
            CancellationToken cancellationToken) =>
        {
            var result = await handler.HandleAsync(
                command,
                cancellationToken);

            if (!result.IsSuccess)
            {
                if (result.Error?.Code == "Registration.DuplicatePlate")
                {
                    return Results.Conflict(result.Error);
                }

                return Results.BadRequest(result.Error);
            }

            var registration = await dbContext.Registrations
                .FirstOrDefaultAsync(
                    r => r.Id == result.Value,
                    cancellationToken);

            if (registration is null)
            {
                return Results.Problem(
                    "Registration was created but could not be retrieved.");
            }

            var paymentStatus =
                registration.AmountPaid == 0 ? "Unpaid" :
                registration.AmountPaid < registration.RegistrationFee ? "Partial" :
                "Paid";

            return Results.Created(
                $"/api/registrations/{registration.Id}",
                new
                {
                    registration.Id,
                    registration.RegistrationNumber,
                    registration.RegistrationDate,
                    registration.ParticipantName,
                    registration.ContactNumber,
                    registration.Email,
                    registration.Address,
                    registration.CarMakeModel,
                    registration.PlateNumber,
                    registration.RegistrationType,
                    registration.Status,
                    registration.RegistrationFee,
                    registration.AmountPaid,
                    PaymentStatus = paymentStatus
                });
        })
        .AddEndpointFilter<ValidationFilter<CreateRegistrationCommand>>();

        return app;
    }
}
