
using Domain.Common;

namespace Api.Extensions;

public static class ResultExtensions
{
    public static IResult ToProblemDetails<T>(this Result<T> result)
    {
        if (result.IsSuccess)
        {
            return Results.Ok(result.Value);
        }

        var error = result.Error!;

        var statusCode = error.Code switch
        {
            "Registration.NotFound" => StatusCodes.Status404NotFound,
            "Registration.DuplicatePlate" => StatusCodes.Status409Conflict,
            _ => StatusCodes.Status400BadRequest
        };

        return Results.Problem(
            statusCode: statusCode,
            title: error.Message,
            extensions: new Dictionary<string, object?>
            {
                ["errorCode"] = error.Code
            });
    }
}
