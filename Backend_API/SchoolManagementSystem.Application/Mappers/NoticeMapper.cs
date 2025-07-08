using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Enums.Notice;

namespace SchoolManagementSystem.Application.Mappers
{
	public class NoticeMapper : IMapper<NoticeDto, Notice>
	{
		public NoticeDto MapToDto(Notice entity)
		{
			return new NoticeDto { 
				Title = entity.Title, 
				Content = entity.Content,
				NoticeType = entity.NoticeType.GetType().Name,
				RecipientType = entity.RecipientType.GetType().Name,
				Method = entity.Method.GetType().Name,
				Status = entity.Status.GetType().Name,
				PublishedDate = entity.PublishedDate,
				ExpiryDate = entity.ExpiryDate,
				CreatedBy = entity.CreatedBy,
			};
		}

		public List<Notice> MapToEntities(IEnumerable<NoticeDto> dtos)
		{
			return dtos.Select(dto => new Notice
			{
				Title = dto.Title,
				Content = dto.Content,
				NoticeType = ToNoticeType(dto.NoticeType),
				RecipientType = ToRecipientType(dto.RecipientType) ,
				Method = ToDeliveryMethodType(dto.Method),
				Status = ToStatusType(dto.Status),
				PublishedDate = DateTime.UtcNow,
				ExpiryDate = dto.ExpiryDate,
				CreatedBy = dto.CreatedBy,
			}).ToList();
		}

		public List<Notice> MapToEntities(NoticeDto dto)
		{
			throw new NotImplementedException();
		}

		public Notice MapToEntity(NoticeDto dto)
		{
			return new Notice {
				Title = dto.Title,
				Content = dto.Content,
				NoticeType = ToNoticeType(dto.NoticeType),
				RecipientType = ToRecipientType(dto.RecipientType),
				Method = ToDeliveryMethodType(dto.Method),
				Status = ToStatusType(dto.Status),
				PublishedDate = DateTime.UtcNow,
				ExpiryDate = dto.ExpiryDate,
				CreatedBy = dto.CreatedBy,
			};
		}

		private NoticeType ToNoticeType(string noticeType)
		{
			return noticeType switch
			{
				"general" => NoticeType.General,
				"event" => NoticeType.Event,
				"reminder" => NoticeType.Remainder,
				_ => NoticeType.General
			};
		}

		private RecipientType ToRecipientType(string recipientType)
		{
			return recipientType switch
			{
				"general" => RecipientType.General,
				"student" => RecipientType.Student,
				"teacher" => RecipientType.Teacher,
				"parent" => RecipientType.Parent,
				"custom" => RecipientType.Custom,
				_ => RecipientType.General
			};
		}

		private Method ToDeliveryMethodType(string method)
		{
			return method switch
			{
				"email" => Method.Email,
				"sms" => Method.SMS,
				"whatsapp" => Method.WhatsApp,
				_ => Method.Email,
			};
		}

		private Status ToStatusType(string status)
		{
			return status switch
			{
				"pending" => Status.Pending,
				"failed" => Status.Failed,
				"sent" => Status.Sent,
				_ => Status.Unknown,
			};
		}
	}
}
