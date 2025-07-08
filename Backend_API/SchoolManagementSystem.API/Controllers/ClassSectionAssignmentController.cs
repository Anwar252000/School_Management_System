using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SchoolManagementSystem.Domain.Interfaces;
using SchoolManagementSystem.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.Services;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassSectionAssignmentController : ControllerBase
    {
        private readonly IClassSectionAssignment _classSectionAssignmentService;
        private readonly ILogger<ClassSectionAssignmentController> _logger;

        public ClassSectionAssignmentController(ILogger<ClassSectionAssignmentController> logger, IClassSectionAssignment classSectionAssignment)
        {
            _logger = logger;
            _classSectionAssignmentService = classSectionAssignment;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<ClassSectionAssignmentDTO>>> GetAllClassAssignments()
        {
            _logger.LogInformation("Fetching all class assignments.");
            try
            {
                var classSection = await _classSectionAssignmentService.GetAllClassesAssignmentAsync();
                _logger.LogInformation("Successfully retrieved {Count} class assignments.", classSection?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<ClassSectionAssignmentDTO>>.SuccessResponse(classSection, "class Assignment retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all class assignments.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ClassSectionAssignment>> GetClassSectionById(int classroomId)
        {
            _logger.LogInformation("Fetching class Assignments with Id {ClassroomId}.", classroomId);
            try
            {
                var classroom = await _classSectionAssignmentService.GetClassSectionAssignmentByIdAsync(classroomId);
                if (classroom == null)
                {
                    _logger.LogWarning("Class Assignment with Id {ClassroomId} not found.", classroomId);
                    return NotFound();
                }

                _logger.LogInformation("Successfully retrieved Class Section with Id {ClassroomId}.", classroomId);
                return Ok(classroom);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching class assignments with Id {ClassroomId}.", classroomId);
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<ClassSectionAssignmentDTO>>> AddClassSectionAssignment([FromBody] ClassSectionAssignmentDTO classroom)
        {
            _logger.LogInformation("Adding a new class assignment with Classroom {classroomId}.", classroom.ClassroomId);
            try
            {
                await _classSectionAssignmentService.AddClassSectionAssignmentAsync(classroom);
                _logger.LogInformation("Successfully added class Section Assignment with Id {ClassroomId}.", classroom.ClassroomId);
                return Ok(ApiResponse<ClassSectionAssignmentDTO>.SuccessResponse(classroom, "Classes Assigned Successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while assigning a new classroom.");
                return StatusCode(500, ApiResponse<ClassSectionAssignmentDTO>.ErrorResponse(ex.Message));
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateClassSectionAssignment(ClassSectionAssignmentDTO classroom)
        {
            _logger.LogInformation("Updating Class Assignment with ID {AssignmentId}.", classroom.AssignmentId);
            try
            {
                await _classSectionAssignmentService.UpdateClassSectionAssignmentAsync(classroom);
                _logger.LogInformation("Successfully updated Class Assigning with ID {AssignmentId}.", classroom.AssignmentId);
                return Ok(ApiResponse<ClassSectionAssignmentDTO>.SuccessResponse(classroom, "Classroom Assignment updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating Class Assignment with ID {AssignmentId}.", classroom.AssignmentId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteClassSectionAssignment(int assignmentId)
        {
            _logger.LogInformation("Deleting class Assignment with ID {AssignmentId}.", assignmentId);
            try
            {
                await _classSectionAssignmentService.DeleteClassSectionAssignmentAsync(assignmentId);
                _logger.LogInformation("Successfully deleted Class Assignment with ID {AssignmentId}.", assignmentId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Class Assignment deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting class assignment with ID {ClassroomId}.", assignmentId);
                return StatusCode(500, "Internal server error.");
            }
        }
    }
}
