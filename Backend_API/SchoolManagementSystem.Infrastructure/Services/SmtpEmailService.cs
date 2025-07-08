using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using SchoolManagementSystem.Infrastructure.Interfaces;

namespace SchoolManagementSystem.Infrastructure.Services
{
	public class SmtpEmailService : IEmailService
	{
		private readonly SmtpEmailConfiguration _emailConfig;

		public SmtpEmailService(IOptions<SmtpEmailConfiguration> options)
		{
			_emailConfig = options.Value;
		}

		public void SendEmail(Message message)
		{
			var emailMessage = CreateEmailMessage(message);

			Send(emailMessage);
		}

		public async Task SendEmailAsync(Message message)
		{
			var emailMessage = CreateEmailMessage(message);

			await SendAsync(emailMessage);
		}

		private MimeMessage CreateEmailMessage(Message message)
		{
			var emailMessage = new MimeMessage();
			emailMessage.From.Add(new MailboxAddress(_emailConfig.From, _emailConfig.From));
			emailMessage.To.AddRange(message.To);
			emailMessage.Subject = message.Subject;
			//emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Text) { Text = message.Content };
			var bodyBuilder = new BodyBuilder() { HtmlBody = message.Content };

			if(message.Attachments != null && message.Attachments.Any())
			{
				byte[] fileBytes;

				foreach (var attachment in message.Attachments)
				{
					using (var ms = new MemoryStream())
					{
						attachment.CopyTo(ms);
						fileBytes = ms.ToArray();
					}

					bodyBuilder.Attachments.Add(attachment.FileName, fileBytes, ContentType.Parse(attachment.ContentType));
				}
			}

			emailMessage.Body = bodyBuilder.ToMessageBody();

			return emailMessage;
		}

		private void Send(MimeMessage emailMessage)
		{
			using (var smtpClient = new SmtpClient())
			{
				try
				{
					smtpClient.Connect(_emailConfig.Host, _emailConfig.Port, true);
					smtpClient.AuthenticationMechanisms.Remove("XOAUTH2");
					smtpClient.Authenticate(_emailConfig.Username, _emailConfig.Password);
					smtpClient.Send(emailMessage);
				}
				catch (Exception)
				{
					throw;
				}
				finally
				{
					smtpClient.Disconnect(true);
					smtpClient.Dispose();
				}
			}
		}


		private async Task SendAsync(MimeMessage emailMessage)
		{
			using (var smtpClient = new SmtpClient())
			{
				try
				{
					await smtpClient.ConnectAsync(_emailConfig.Host, _emailConfig.Port, true);
					smtpClient.AuthenticationMechanisms.Remove("XOAUTH2");
					await smtpClient.AuthenticateAsync(_emailConfig.Username, _emailConfig.Password);
					await smtpClient.SendAsync(emailMessage);
				}
				catch (Exception)
				{
					throw;
				}
				finally
				{
					await smtpClient.DisconnectAsync(true);
					smtpClient.Dispose();
				}
			}
		}
	}
}
