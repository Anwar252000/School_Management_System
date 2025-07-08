using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassroomController : ControllerBase
    {
        private readonly IClassroom _classroomService;
        private readonly ILogger<ClassroomController> _logger;

        public ClassroomController(ILogger<ClassroomController> logger, IClassroom classroom)
        {
            _logger = logger;
            _classroomService = classroom;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<ClassroomDTO>>> GetClassroom()
        {
            _logger.LogInformation("Fetching all classrooms.");
            try
            {
                var classrooms = await _classroomService.GetAllClassroomAsync();
                _logger.LogInformation("Successfully retrieved {Count} classrooms.", classrooms?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<ClassroomDTO>>.SuccessResponse(classrooms, "classroom retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all classrooms.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<Classroom>> GetClassroomById(int classroomId)
        {
            _logger.LogInformation("Fetching classroom with Id {ClassroomId}.", classroomId);
            try
            {
                var classroom = await _classroomService.GetClassroomByIdAsync(classroomId);
                if (classroom == null)
                {
                    _logger.LogWarning("Classroom with Id {ClassroomId} not found.", classroomId);
                    return NotFound();
                }

                _logger.LogInformation("Successfully retrieved Classroom with Id {ClassroomId}.", classroomId);
                return Ok(classroom);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching classroom with Id {ClassroomId}.", classroomId);
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<ClassroomDTO>>> AddClassroom([FromBody] ClassroomDTO clroom)
        {
            _logger.LogInformation("Adding a new classroom with RoomNumber {RoomNumber}.", clroom.RoomNumber);
            try
            {
                await _classroomService.AddClassroomAsync(clroom);
                _logger.LogInformation("Successfully added classroom with Id {ClassroomId}.", clroom.ClassroomId);
                return Ok(ApiResponse<ClassroomDTO>.SuccessResponse(clroom, "Classroom Added Successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new classroom.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateClassroom(ClassroomDTO clroom)
        {
            _logger.LogInformation("Updating Classroom with ID {ClassId}.", clroom.ClassroomId);
            try
            {
                await _classroomService.UpdateClassroomAsync(clroom);
                _logger.LogInformation("Successfully updated Classroom with ID {ClassroomId}.", clroom.ClassroomId);
                return Ok(ApiResponse<ClassroomDTO>.SuccessResponse(clroom, "Classroom updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating Classroom with ID {ClassroomId}.", clroom.ClassroomId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteClassroom(int classroomId)
        {
            _logger.LogInformation("Deleting classroom with ID {ClassroomId}.", classroomId);
            try
            {
                await _classroomService.DeleteClassroomAsync(classroomId);
                _logger.LogInformation("Successfully deleted Classroom with ID {ClassroomId}.", classroomId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Classroom deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting classroom with ID {ClassroomId}.", classroomId);
                return StatusCode(500, "Internal server error.");
            }
        }
    }
}
