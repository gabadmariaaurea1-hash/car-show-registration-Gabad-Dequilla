
using FluentValidation;
using System.Text.RegularExpressions;

namespace Application.Features.Registration.CreateRegistration;

public sealed class CreateRegistrationValidator
    : AbstractValidator<CreateRegistrationCommand>
{
    public CreateRegistrationValidator()
    {
        RuleFor(x => x.ParticipantName)
            .NotEmpty()
            .MaximumLength(150);

        RuleFor(x => x.ContactNumber)
            .NotEmpty()
            .Must(x => Regex.IsMatch(x, @"^09\d{9}$"))
            .WithMessage("Contact number must be a valid 11-digit Philippine mobile number.");

        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(200);

        RuleFor(x => x.Address)
            .NotEmpty()
            .MaximumLength(300);

        RuleFor(x => x.CarMakeModel)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.PlateNumber)
            .NotEmpty()
            .MaximumLength(15);

        RuleFor(x => x.RegistrationType)
            .IsInEnum();

        RuleFor(x => x.AmountPaid)
            .GreaterThanOrEqualTo(0)
            .Must((command, amount) =>
                command.RegistrationType switch
                {
                    Domain.Enums.RegistrationType.Exhibitor => amount <= 1500,
                    Domain.Enums.RegistrationType.Competitor => amount <= 2500,
                    Domain.Enums.RegistrationType.VIP => amount <= 5000,
                    _ => false
                })
            .WithMessage("Amount paid cannot exceed the registration fee.");
    }
}
