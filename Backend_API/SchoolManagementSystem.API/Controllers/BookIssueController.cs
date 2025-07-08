using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs.Library;
using SchoolManagementSystem.Application.Interfaces;

namespace SchoolManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookIssueController : ControllerBase
    {
        private readonly IBookIssue _issueService;
        private readonly ILogger<BookIssueController> _logger;

        public BookIssueController(ILogger<BookIssueController> logger, IBookIssue issueService)
        {
            _logger = logger;
            _issueService = issueService;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<BookIssueDTO>>> GetIssue()
        {
            try
            {
                var data = await _issueService.GetAllIssueAsync();
                return Ok(ApiResponse<IEnumerable<BookIssueDTO>>.SuccessResponse(data, "Issues retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving issues");
                return StatusCode(500, ApiResponse<IEnumerable<BookIssueDTO>>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<BookIssueDTO>>> AddIssue([FromBody] BookIssueDTO dto)
        {
            try
            {
                await _issueService.AddIssueAsync(dto);
                return Ok(ApiResponse<BookIssueDTO>.SuccessResponse(dto, "Issue added successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding issue");
                return StatusCode(500, ApiResponse<BookIssueDTO>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateIssue([FromBody] BookIssueDTO dto)
        {
            try
            {
                await _issueService.UpdateIssueAsync(dto);
                return Ok(ApiResponse<BookIssueDTO>.SuccessResponse(dto, "Issue updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating issue");
                return StatusCode(500, ApiResponse<BookIssueDTO>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteIssue(int issueId)
        {
            try
            {
                await _issueService.DeleteIssueAsync(issueId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Issue deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting issue");
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
