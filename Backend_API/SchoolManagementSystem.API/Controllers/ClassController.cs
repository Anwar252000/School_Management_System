using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassController : ControllerBase
    {
        private readonly IClass _classService;
        private readonly ILogger<ClassController> _logger;

        public ClassController(ILogger<ClassController> logger, IClass classes)
        {
            _logger = logger;
            _classService = classes;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<ClassDto>>> GetClass()
        {
            _logger.LogInformation("Fetching all classes.");
            try
            {
                var classes = await _classService.GetAllClassAsync();
                _logger.LogInformation("Successfully retrieved {Count} classes.", classes?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<ClassDto>>.SuccessResponse(classes, "classes retrieved successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all classes.");
                return StatusCode(500, ApiResponse<IEnumerable<ClassDto>>.ErrorResponse("Internal server error."));

            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ClassDto>> GetClassById(int id)
        {
            _logger.LogInformation("Fetching classes with ID {ClassId}.", id);
            try
            {
                var classes = await _classService.GetClassByIdAsync(id);
                if (classes == null)
                {
                    _logger.LogWarning("class with ID {ClassId} not found.", id);
                    return NotFound();
                }

                _logger.LogInformation("Successfully retrieved class with ID {ClassId}.", id);
                return Ok(classes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching class with ID {ClassId}.", id);
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<ClassDto>>> AddClass([FromBody] ClassDto dto)
        {
            _logger.LogInformation("Adding a new class with name {ClassName}.", dto.ClassName);
            try
            {
                await _classService.AddClassAsync(dto);
                _logger.LogInformation("Successfully added Class with ID {ClassId}.", dto.ClassId);
                return Ok(ApiResponse<ClassDto>.SuccessResponse(dto, "Classes Added successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new class.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateClass(ClassDto classes)
        {
            _logger.LogInformation("Updating Class with ID {ClassId}.", classes.ClassId);
            try
            {
                await _classService.UpdateClassAsync(classes);
                _logger.LogInformation("Successfully updated Class with ID {ClassId}.", classes.ClassId);
                return Ok(ApiResponse<ClassDto>.SuccessResponse(classes, "Class updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating Class with ID {ClassId}.", classes.ClassId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteClass(int classId)
        {

            _logger.LogInformation("Deleting class with ID {ClassID}.", classId);
            try
            {
                await _classService.DeleteClassAsync(classId);
                _logger.LogInformation("Successfully deleted Class with ID {ClassId}.", classId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Class deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting Class with ID {ClassId}.", classId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }

        }
    }
}
