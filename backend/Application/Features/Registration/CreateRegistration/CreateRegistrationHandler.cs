using Domain.Entities;
using Domain.Enums;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Common;
using Microsoft.EntityFrameworkCore;
using RegistrationEntity = Domain.Entities.Registration;

namespace Application.Features.Registration.CreateRegistration;

public sealed class CreateRegistrationHandler
    : ICommandHandler<CreateRegistrationCommand, Result<Guid>>
{
    private readonly IAppDbContext _dbContext;

    public CreateRegistrationHandler(IAppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<Guid>> HandleAsync(
        CreateRegistrationCommand command,
        CancellationToken cancellationToken = default)
    {
        // Check duplicate plate number
        var plateExists = await _dbContext.Registrations
            .AnyAsync(
                r => r.PlateNumber == command.PlateNumber,
                cancellationToken);

        if (plateExists)
        {
            return Result<Guid>.Failure(
                Error.Validation(
                    "Registration.DuplicatePlate",
                    "This plate number is already registered."));
        }

        // Determine registration fee
        var registrationFee = command.RegistrationType switch
        {
            RegistrationType.Exhibitor => 1500m,
            RegistrationType.Competitor => 2500m,
            RegistrationType.VIP => 5000m,
            _ => -1m
        };

        if (registrationFee < 0)
        {
            return Result<Guid>.Failure(
                Error.Validation(
                    "Registration.InvalidType",
                    "Invalid registration type."));
        }

        // Validate payment
        if (command.AmountPaid < 0 ||
            command.AmountPaid > registrationFee)
        {
            return Result<Guid>.Failure(
                Error.Validation(
                    "Registration.InvalidPayment",
                    "Invalid payment amount."));
        }

        // Generate registration number
        var count = await _dbContext.Registrations.CountAsync(
            cancellationToken);

        var registration = new RegistrationEntity
        {
            Id = Guid.NewGuid(),
            RegistrationNumber = $"CS27-{count + 1:D4}",
            RegistrationDate = DateTime.UtcNow,
            ParticipantName = command.ParticipantName,
            ContactNumber = command.ContactNumber,
            Email = command.Email,
            Address = command.Address,
            CarMakeModel = command.CarMakeModel,
            PlateNumber = command.PlateNumber,
            RegistrationType = command.RegistrationType,
            Status = RegistrationStatus.Pending,
            RegistrationFee = registrationFee,
            AmountPaid = command.AmountPaid
        };

        // Save to database
        _dbContext.Registrations.Add(registration);

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(registration.Id);
    }
}
