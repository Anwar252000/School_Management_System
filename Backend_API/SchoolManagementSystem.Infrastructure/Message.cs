﻿using Microsoft.AspNetCore.Http;
using MimeKit;

namespace SchoolManagementSystem.Infrastructure
{
	public class Message
	{
		public List<MailboxAddress> To { get; set; }
		public string Subject { get; set; }
		public string Content { get; set; }
        public IFormFileCollection? Attachments { get; set; }

        public Message(IEnumerable<string> to, string subject, string content, IFormFileCollection? attachments = null)
		{
			To = [.. to.Select(x => new MailboxAddress(x, x))];

			Subject = subject;
			Content = content;
			Attachments = attachments;
		}
	}
}
