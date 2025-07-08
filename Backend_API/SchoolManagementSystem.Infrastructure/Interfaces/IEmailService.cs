namespace SchoolManagementSystem.Infrastructure.Interfaces
{
	public interface IEmailService
	{
		void SendEmail(Message message);
		Task SendEmailAsync(Message message);
	}
}
