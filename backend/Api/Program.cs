using Domain.Entities;
using Domain.Enums;
using Api.Endpoints;
using Api.Filters;
using Application.Abstractions.Data;
using Application.Features.Registration.CreateRegistration;
using Application.Features.Registration.GetRegistrations;
using Application.Features.Registration.GetRegistrationById;
using Application.Features.Registration.GetRegistrationSummary;
using FluentValidation;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<IAppDbContext, AppDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// Validators
builder.Services.AddValidatorsFromAssembly(
    typeof(IAppDbContext).Assembly);

// Handlers
builder.Services.AddScoped<CreateRegistrationHandler>();
builder.Services.AddScoped<GetRegistrationsHandler>();
builder.Services.AddScoped<GetRegistrationByIdHandler>();
builder.Services.AddScoped<GetRegistrationSummaryHandler>();

// Validators
builder.Services.AddScoped<IValidator<CreateRegistrationCommand>, CreateRegistrationValidator>();
builder.Services.AddScoped<IValidator<GetRegistrationsQuery>, GetRegistrationsValidator>();

// Validation Filters
builder.Services.AddScoped<ValidationFilter<CreateRegistrationCommand>>();
builder.Services.AddScoped<ValidationFilter<GetRegistrationsQuery>>();

// JSON - Serialize enums as strings
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(
        new JsonStringEnumConverter());
});

// CORS - Allow React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// API
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, _, _) =>
    {
        document.Info.Title = "Car Show Registration API";
        document.Info.Description =
            "Car Show Registration System Backend API";

        return Task.CompletedTask;
    });
});

var app = builder.Build();


// Seed data
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    var registrationTypes = Enum.GetValues<RegistrationType>();
    var statuses = Enum.GetValues<RegistrationStatus>();

    for (var i = 4; i <= 25; i++)
    {
        var type = registrationTypes[(i - 4) % registrationTypes.Length];
        var status = statuses[(i - 4) % statuses.Length];

        var fee = type switch
        {
            RegistrationType.Exhibitor => 1500m,
            RegistrationType.Competitor => 2500m,
            RegistrationType.VIP => 5000m,
            _ => 0m
        };

       var paymentPattern = (i - 4) % 3;

var amountPaid = paymentPattern switch
{
    0 => 0m,
    1 => fee / 2m,
    _ => fee
};

var registrationNumber = $"CS27-{i:D4}";
var plateNumber = $"SEED {i:D4}";

var existing = dbContext.Registrations.FirstOrDefault(r =>
    r.PlateNumber == plateNumber ||
    r.RegistrationNumber == registrationNumber);

if (existing is not null)
{
    existing.AmountPaid = amountPaid;
    continue;
}

        dbContext.Registrations.Add(new Registration
        {
            RegistrationNumber = registrationNumber,
            RegistrationDate = DateTime.UtcNow.AddDays(-i),
            ParticipantName = $"Seed Participant {i:D2}",
            ContactNumber = "09171234567",
            Email = $"participant{i:D2}@example.com",
            Address = "Naga City, Camarines Sur",
            CarMakeModel = "Toyota Vios",
            PlateNumber = plateNumber,
            RegistrationType = type,
            Status = status,
            RegistrationFee = fee,
            AmountPaid = amountPaid
        });
    }

    dbContext.SaveChanges();
}

// Configure HTTP request pipeline
app.UseCors("AllowReact");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// Root endpoint
app.MapGet("/", () =>
    "Welcome to the Car Show Registration API! Go to /scalar/v1 for API documentation.");

// Map endpoints
app.MapCreateRegistrationEndpoint();
app.MapGetRegistrationsEndpoint();
app.MapGetRegistrationByIdEndpoint();
app.MapGetRegistrationSummaryEndpoint();

app.Run();
