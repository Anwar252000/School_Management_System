using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
	public interface INoticeService
	{
		Task<IEnumerable<NoticeDto>> Get();
		Task SendNotice(NoticeDto noticeDto);
	}
}
