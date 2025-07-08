namespace SchoolManagementSystem.Infrastructure.Services
{
	public class SmtpEmailConfiguration
	{
        public string Host { get; set; }
        public int Port { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Secure { get; set; }
        public string From { get; set; }
    }
}