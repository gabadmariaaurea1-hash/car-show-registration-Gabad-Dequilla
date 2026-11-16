
using Application.Abstractions.Messaging;
using Domain.Common;

namespace Application.Features.Registration.GetRegistrationById;

public sealed record GetRegistrationByIdQuery(
    Guid Id
) : IQuery<Result<RegistrationByIdResponse>>;

public sealed record RegistrationByIdResponse(
    Guid Id,
    string RegistrationNumber,
    DateTime RegistrationDate,
    string ParticipantName,
    string ContactNumber,
    string Email,
    string Address,
    string CarMakeModel,
    string PlateNumber,
    string RegistrationType,
    string Status,
    decimal RegistrationFee,
    decimal AmountPaid,
    string PaymentStatus
);
