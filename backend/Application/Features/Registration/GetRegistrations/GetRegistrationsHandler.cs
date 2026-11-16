
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Registration.GetRegistrations;

public sealed class GetRegistrationsHandler
    : IQueryHandler<GetRegistrationsQuery, PagedResponse<RegistrationResponse>>
{
    private readonly IAppDbContext _dbContext;

    public GetRegistrationsHandler(IAppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResponse<RegistrationResponse>> HandleAsync(
        GetRegistrationsQuery query,
        CancellationToken cancellationToken = default)
    {
        var registrations = _dbContext.Registrations
            .AsNoTracking()
            .AsQueryable();

        // Filter by registration type
        if (query.Type.HasValue)
        {
            registrations = registrations.Where(
                r => r.RegistrationType == query.Type.Value);
        }

        // Filter by registration status
        if (query.Status.HasValue)
        {
            registrations = registrations.Where(
                r => r.Status == query.Status.Value);
        }

        // Filter by participant name (case-insensitive)
        if (!string.IsNullOrWhiteSpace(query.ParticipantName))
        {
            var name = query.ParticipantName.Trim().ToLower();

            registrations = registrations.Where(
                r => r.ParticipantName.ToLower().Contains(name));
        }

        // Get total count before pagination
        var totalCount = await registrations.CountAsync(cancellationToken);

        // Get paged registrations, newest first
        var records = await registrations
            .OrderByDescending(r => r.RegistrationDate)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        // Convert entities into response objects
        var items = records.Select(r => new RegistrationResponse(
            r.Id,
            r.RegistrationNumber,
            r.RegistrationDate,
            r.ParticipantName,
            r.ContactNumber,
            r.Email,
            r.Address,
            r.CarMakeModel,
            r.PlateNumber,
            r.RegistrationType.ToString(),
            r.Status.ToString(),
            r.RegistrationFee,
            r.AmountPaid,
            r.AmountPaid == 0 ? "Unpaid" :
            r.AmountPaid < r.RegistrationFee ? "Partial" : "Paid"
        )).ToList();

        var totalPages = totalCount == 0
            ? 0
            : (int)Math.Ceiling((double)totalCount / query.PageSize);

        return new PagedResponse<RegistrationResponse>(
            items,
            query.Page,
            query.PageSize,
            totalCount,
            totalPages
        );
    }
}
