using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.Application.DTOs.Fee;
using SchoolManagementSystem.Application.Interfaces;

namespace SchoolManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
	[ApiController]
	public class FeeController : ControllerBase
	{
		private readonly IFeeService _feeService;
		private readonly ILogger<FeeController> _logger;

		public FeeController(IFeeService feeService, ILogger<FeeController> logger)
        {
			_feeService = feeService;
			_logger = logger;
		}

        [HttpPost("AssignFees")]
		public async Task<IActionResult> AssignFees()
		{
			try
			{
				await _feeService.AssignFeesToStudentsAsync();
				return Ok("Fees assigned successfully");
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Fees assignment operation failed.");
				return StatusCode(500, "Internal Server Error");
			}
		}

		[HttpPost("ApplyDiscount")]
		public async Task<IActionResult> ApplyDiscount([FromBody] ApplyDiscountDto dto)
		{
			try
			{
                await _feeService.ApplyDiscountAsync(dto.StudentId, dto.DiscountAmount, dto.Reason, dto.CreatedBy);
				return Ok("Discount applied successfully");
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Applying discount operation failed.");
				return StatusCode(500, "Internal Server Error");
			}
		}

		[HttpGet("GetStudentFees")]
		public async Task<IActionResult> GetStudentFees()
		{
			try
			{
				var result = await _feeService.GetStudentFeesAsync();
				return Ok(result);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Getting students fee operation failed.");
				return StatusCode(500, "Internal Server Error");
			}
		}
	}
}
