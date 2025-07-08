using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;

namespace SchoolManagementSystem.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class NoticesController : ControllerBase
	{
		private readonly INoticeService _noticeService;
		private readonly ILogger<NoticesController> _logger;

		public NoticesController(INoticeService noticeService, ILogger<NoticesController> logger)
        {
			_noticeService = noticeService;
			_logger = logger;
		}

        [HttpGet("[action]")]
		public async Task<ActionResult<ApiResponse<NoticeDto>>> Get()
		{
			try
			{
				var result = await _noticeService.Get();

				return Ok(ApiResponse<IEnumerable<NoticeDto>>.SuccessResponse(result, "Operation Successfull"));
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "An error occurred while fetching all academic years.");
				return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
			}
		}

		[HttpPost("[action]")]
		public async Task<ActionResult<ApiResponse<object?>>> SendNotice(NoticeDto request)
		{
			try
			{
				await _noticeService.SendNotice(request);

				return Ok(ApiResponse<object?>.SuccessResponse(null, "Notices sent successfully."));
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "An error occurred while fetching all academic years.");
				return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
			}
		}
	}
}
