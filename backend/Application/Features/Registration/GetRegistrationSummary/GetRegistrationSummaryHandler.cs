
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Registration.GetRegistrationSummary;

public sealed class GetRegistrationSummaryHandler
    : IQueryHandler<GetRegistrationSummaryQuery, GetRegistrationSummaryResponse>
{
    private readonly IAppDbContext _context;

    public GetRegistrationSummaryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<GetRegistrationSummaryResponse> HandleAsync(
        GetRegistrationSummaryQuery query,
        CancellationToken cancellationToken = default)
    {
        var registrations = await _context.Registrations
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return new GetRegistrationSummaryResponse(
            TotalRegistrations: registrations.Count,

            TotalExhibitors: registrations.Count(r =>
                r.RegistrationType == Domain.Enums.RegistrationType.Exhibitor),

            TotalCompetitors: registrations.Count(r =>
                r.RegistrationType == Domain.Enums.RegistrationType.Competitor),

            TotalVIP: registrations.Count(r =>
                r.RegistrationType == Domain.Enums.RegistrationType.VIP),

            Pending: registrations.Count(r =>
                r.Status == Domain.Enums.RegistrationStatus.Pending),

            Confirmed: registrations.Count(r =>
                r.Status == Domain.Enums.RegistrationStatus.Confirmed),

            CheckedIn: registrations.Count(r =>
                r.Status == Domain.Enums.RegistrationStatus.CheckedIn),

            Cancelled: registrations.Count(r =>
                r.Status == Domain.Enums.RegistrationStatus.Cancelled),

            TotalRegistrationFees: registrations.Sum(r => r.RegistrationFee),

            TotalAmountPaid: registrations.Sum(r => r.AmountPaid),

            TotalOutstandingBalance: registrations.Sum(r =>
                r.RegistrationFee - r.AmountPaid)
        );
    }
}
