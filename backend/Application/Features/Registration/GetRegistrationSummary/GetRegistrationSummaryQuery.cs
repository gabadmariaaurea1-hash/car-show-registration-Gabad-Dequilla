using Application.Abstractions.Messaging;

namespace Application.Features.Registration.GetRegistrationSummary;

public sealed record GetRegistrationSummaryQuery
    : IQuery<GetRegistrationSummaryResponse>;

public sealed record GetRegistrationSummaryResponse(
    int TotalRegistrations,
    int TotalExhibitors,
    int TotalCompetitors,
    int TotalVIP,
    int Pending,
    int Confirmed,
    int CheckedIn,
    int Cancelled,
    decimal TotalRegistrationFees,
    decimal TotalAmountPaid,
    decimal TotalOutstandingBalance
);