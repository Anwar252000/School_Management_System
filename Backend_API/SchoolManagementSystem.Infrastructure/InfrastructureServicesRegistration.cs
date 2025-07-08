using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SchoolManagementSystem.Infrastructure.Interfaces;
using SchoolManagementSystem.Infrastructure.Services;

namespace SchoolManagementSystem.Infrastructure
{
	public static class InfrastructureServicesRegistration
	{
		public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
		{
			services.Configure<SmtpEmailConfiguration>(configuration.GetSection("EmailConfiguration"));
			services.AddScoped<IEmailService, SmtpEmailService>();

			services.Configure<FormOptions>(options =>
			{
				options.ValueLengthLimit = int.MaxValue;
				options.MultipartBodyLengthLimit = int.MaxValue;
				options.MemoryBufferThreshold = int.MaxValue;
			});

			return services;
		}
	}

}
