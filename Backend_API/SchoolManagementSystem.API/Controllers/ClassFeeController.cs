using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassFeeController : ControllerBase
    {
        private readonly IClassFee _classFeeService;
        private readonly ILogger<ClassFeeController> _logger;

        public ClassFeeController(ILogger<ClassFeeController> logger, IClassFee classFee)
        {
            _logger = logger;
            _classFeeService = classFee;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<ClassFeeDTO>>> GetClassFee()
        {
            _logger.LogInformation("Fetching all Class Fee.");
            try
            {
                var classFee = await _classFeeService.GetAllClassFeeAsync();
                _logger.LogInformation("Successfully retrieved {Count} Class Fee.", classFee?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<ClassFeeDTO>>.SuccessResponse(classFee, "Class Fee retrieved successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all Class Fee.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ClassFeeDTO>> GetClassFeeById(int id)
        {
            _logger.LogInformation("Fetching Class Fee with ID {ClassFeeId}.", id);
            try
            {
                var classFee = await _classFeeService.GetClassFeeByIdAsync(id);
                if (classFee == null)
                {
                    _logger.LogWarning("Class Fee with ID {ClassFeeId} not found.", id);
                    return NotFound();
                }

                _logger.LogInformation("Successfully retrieved Class Fee with ID {ClassFeeId}.", id);
                return Ok(classFee);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching Class Fee with ID {ClassFeeId}.", id);
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<ClassFeeDTO>>> AddClassFee([FromBody] ClassFeeDTO classFee)
        {
            _logger.LogInformation("Adding a new Class Fee with amount .", classFee.Amount);
            try
            {
                await _classFeeService.AddClassFeeAsync(classFee);
                _logger.LogInformation("Successfully added Class Fee with ID {ClassFeeId}.", classFee.ClassFeeId);
                return Ok(ApiResponse<ClassFeeDTO>.SuccessResponse(classFee, "Class Fee Added Successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new Class Fee.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateClassFee(ClassFeeDTO classFee)
        {

            _logger.LogInformation("Updating Class Fee with ID .", classFee.ClassFeeId);
            try
            {
                await _classFeeService.UpdateClassFeeAsync(classFee);
                _logger.LogInformation("Successfully updated Class Fee with ID ClassFeeId.", classFee.ClassFeeId);
                return Ok(ApiResponse<ClassFeeDTO>.SuccessResponse(classFee, "Section updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating Class Fee with ID {ClassFeeId}.", classFee.ClassFeeId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteClassFee(int classFeeId)
        {
            _logger.LogInformation("Deleting selection with ID {ClassFeeId}.", classFeeId);
            try
            {
                await _classFeeService.DeleteClassFeeAsync(classFeeId);
                _logger.LogInformation("Successfully deleted Class Fee with ID {ClassFeeId}.", classFeeId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Class Fee deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting Class Fee with ID {ClassFeeId}.", classFeeId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
