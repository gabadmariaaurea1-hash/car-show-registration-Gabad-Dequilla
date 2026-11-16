
using FluentValidation;
using Microsoft.AspNetCore.Http;
using System.Linq;

namespace Api.Filters;

public sealed class ValidationFilter<T> : IEndpointFilter
    where T : notnull
{
    private readonly IValidator<T> _validator;

    public ValidationFilter(IValidator<T> validator)
    {
        _validator = validator;
    }

    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next)
    {
        var argument = context.Arguments
            .OfType<T>()
            .FirstOrDefault();

        if (argument is null)
        {
            return await next(context);
        }

        var validation = await _validator.ValidateAsync(
            argument,
            context.HttpContext.RequestAborted);

        if (!validation.IsValid)
        {
            return Results.ValidationProblem(
                validation.ToDictionary());
        }

        return await next(context);
    }
}
