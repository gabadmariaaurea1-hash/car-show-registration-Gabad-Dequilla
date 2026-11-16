
using FluentValidation;

namespace Application.Features.Registration.GetRegistrations;

public sealed class GetRegistrationsValidator
    : AbstractValidator<GetRegistrationsQuery>
{
    public GetRegistrationsValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1)
            .WithMessage("Page must be at least 1.");

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, 50)
            .WithMessage("PageSize must be between 1 and 50.");

        RuleFor(x => x.ParticipantName)
            .MaximumLength(150)
            .WithMessage("ParticipantName must not exceed 150 characters.");

        RuleFor(x => x.Type)
            .Must(type => !type.HasValue || Enum.IsDefined(type.Value))
            .WithMessage("Invalid registration type.");

        RuleFor(x => x.Status)
            .Must(status => !status.HasValue || Enum.IsDefined(status.Value))
            .WithMessage("Invalid registration status.");
    }
}
