using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;


namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ParentFeedbackController : ControllerBase
    {
        private readonly IParentFeedback _parentFeedbackService;
        private readonly ILogger<ParentFeedbackController> _logger;

        public ParentFeedbackController(ILogger<ParentFeedbackController> logger, IParentFeedback parentFeedback)
        {
            _logger = logger;
            _parentFeedbackService = parentFeedback;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<ParentFeedbackDTO>>> GetAllParentFeedbacks()
        {
            _logger.LogInformation("Fetching all ParentFeedback.");
            try
            {
                var parentFeedbacks = await _parentFeedbackService.GetAllParentFeedbackAsync();
                _logger.LogInformation("Successfully retrieved {Count} ParentFeedbacks.", parentFeedbacks?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<ParentFeedbackDTO>>.SuccessResponse(parentFeedbacks, "ParentFeedbacks retrieved successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all ParentFeedbacks.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<ParentFeedbackDTO>>> AddParentFeedback([FromBody] ParentFeedbackDTO dto)
        {
            _logger.LogInformation("Adding a new ParentFeedback with name {FirstName}.", dto.ParentId);
            try
            {
                await _parentFeedbackService.AddParentFeedbackAsync(dto);
                _logger.LogInformation("Successfully added ParentFeedback with ID {ParentFeedbackId}.", dto.ParentFeedbackId);
                return Ok(ApiResponse<ParentFeedbackDTO>.SuccessResponse(dto, "ParentFeedback Added Successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new ParentFeedback Info.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateParentFeedback(ParentFeedbackDTO dto)
        {

            _logger.LogInformation("Updating ParentFeedback with ID .", dto.ParentFeedbackId);
            try
            {
                await _parentFeedbackService.UpdateParentFeedbackAsync(dto);
                _logger.LogInformation("Successfully updated ParentFeedback with ID ParentFeedbackId.", dto.ParentFeedbackId);
                return Ok(ApiResponse<ParentFeedbackDTO>.SuccessResponse(dto, "ParentFeedback updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating ParentFeedback with ID {ParentFeedbackId}.", dto.ParentFeedbackId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteParentFeedback(int parentFeedbackId)
        {
            _logger.LogInformation("Deleting selection with ID {ParentFeedbackId}.", parentFeedbackId);
            try
            {
                await _parentFeedbackService.DeleteParentFeedbackAsync(parentFeedbackId);
                _logger.LogInformation("Successfully deleted ParentFeedback with ID {ParentFeedbackId}.", parentFeedbackId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Section deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting ParentFeedback with ID {ParentFeedbackId}.", parentFeedbackId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
