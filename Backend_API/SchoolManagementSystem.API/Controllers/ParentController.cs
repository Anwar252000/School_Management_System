using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;


namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ParentController : ControllerBase
    {
        private readonly IParent _parentService;
        private readonly ILogger<ParentController> _logger;

        public ParentController(ILogger<ParentController> logger, IParent parent)
        {
            _logger = logger;
            _parentService = parent;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<ParentDTO>>> GetParents()
        {
            _logger.LogInformation("Fetching all Parent.");
            try
            {
                var parents = await _parentService.GetAllParentAsync();
                _logger.LogInformation("Successfully retrieved {Count} Parents.", parents?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<ParentDTO>>.SuccessResponse(parents, "Parents retrieved successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all parents.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<ParentDTO>>> AddParent([FromBody] ParentDTO dto)
        {
            _logger.LogInformation("Adding a new Parent with name {FirstName}.", dto.FirstName);
            try
            {
                await _parentService.AddParentAsync(dto);
                _logger.LogInformation("Successfully added Parent with ID {ParentId}.", dto.ParentId);
                return Ok(ApiResponse<ParentDTO>.SuccessResponse(dto, "Parent Added Successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new Parent Info.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateParent(ParentDTO dto)
        {

            _logger.LogInformation("Updating Parent with ID .", dto.ParentId);
            try
            {
                await _parentService.UpdateParentAsync(dto);
                _logger.LogInformation("Successfully updated Parent with ID ParentId.", dto.ParentId);
                return Ok(ApiResponse<ParentDTO>.SuccessResponse(dto, "Parent updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating Parent with ID {ParentId}.", dto.ParentId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteParent(int parentId)
        {
            _logger.LogInformation("Deleting selection with ID {ParentId}.", parentId);
            try
            {
                await _parentService.DeleteParentAsync(parentId);
                _logger.LogInformation("Successfully deleted Parent with ID {ParentId}.", parentId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Section deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting Parent with ID {ParentId}.", parentId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
