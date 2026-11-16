
using Application.Abstractions.Messaging;
using Domain.Enums;

namespace Application.Features.Registration.GetRegistrations;

public record GetRegistrationsQuery(
    int Page = 1,
    int PageSize = 10,
    RegistrationType? Type = null,
    RegistrationStatus? Status = null,
    string? ParticipantName = null
) : IQuery<PagedResponse<RegistrationResponse>>;

public record PagedResponse<T>(
    List<T> Items,
    int Page,
    int PageSize,
    int TotalCount,
    int TotalPages
);

public record RegistrationResponse(
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
