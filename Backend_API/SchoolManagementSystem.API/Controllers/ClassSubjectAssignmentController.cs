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
    public class ClassSubjectAssignmentController : ControllerBase
    {
        private readonly IClassSubject _classSubjectService;
        private readonly ILogger<ClassSubjectAssignmentController> _logger;

        public ClassSubjectAssignmentController(ILogger<ClassSubjectAssignmentController> logger, IClassSubject classSubjectAssignment)
        {
            _logger = logger;
            _classSubjectService = classSubjectAssignment;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<ClassSubjectAssignmentDTO>>> GetAllClassSubjectAssignment()
        {
            _logger.LogInformation("Fetching all class subject assignments.");
            try
            {
                var classSubject = await _classSubjectService.GetAllClassSubjectAsync();
                _logger.LogInformation("Successfully retrieved {Count} class subject assignments.", classSubject?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<ClassSubjectAssignmentDTO>>.SuccessResponse(classSubject, "Class Subject Assignment retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all class subject assignments.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ClassSubject>> GetClassSubjectById(int classsubjectId)
        {
            _logger.LogInformation("Fetching class subject Assignments with Id {ClassSubjectId}.", classsubjectId);
            try
            {
                var classSubject = await _classSubjectService.GetClassSubjectByIdAsync(classsubjectId);
                if (classSubject == null)
                {
                    _logger.LogWarning("Class Subject Assignment with Id {ClassSubjectId} not found.", classsubjectId);
                    return NotFound();
                }

                _logger.LogInformation("Successfully retrieved Class Subject Assignment with Id {ClassSubjectId}.", classsubjectId);
                return Ok(classSubject);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching class subject assignments with Id {ClassSubjectId}.", classsubjectId);
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<ClassSubjectAssignmentDTO>>> AddClassSubjectAssignment([FromBody] ClassSubjectAssignmentDTO classsubject)
        {
            _logger.LogInformation("Adding a new class subject assignment with ClassSubject {classSubjectId}.", classsubject.ClassSubjectId);
            try
            {
                await _classSubjectService.AddClassSubjectAsync(classsubject);
                _logger.LogInformation("Successfully added class subject Assignment with Id {ClassSubjectId}.", classsubject.ClassSubjectId);
                return Ok(ApiResponse<ClassSubjectAssignmentDTO>.SuccessResponse(classsubject, "Subject Assigned to Class Successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while assigning a new subject to the class.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateClassSubjectAssignment(ClassSubjectAssignmentDTO classsubject)
        {
            _logger.LogInformation("Updating Class Subject Assignment with ID {ClassId}.", classsubject.ClassId);
            try
            {
                await _classSubjectService.UpdateClassSubjectAsync(classsubject);
                _logger.LogInformation("Successfully updated Subjects Assigning to Class with ID {ClassId}.", classsubject.ClassId);
                return Ok(ApiResponse<ClassSubjectAssignmentDTO>.SuccessResponse(classsubject, "Subjects Assignment updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating Class Subject Assignment with ID {ClassId}.", classsubject.ClassId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteClassSubjectAssignment(int classId)
        {
            _logger.LogInformation("Deleting class Subject Assignment with ID {classId}.", classId);
            try
            {
                await _classSubjectService.DeleteClassSubjectAsync(classId);
                _logger.LogInformation("Successfully deleted Class Subject Assignment with ID {classId}.", classId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Subjects Assigned to Class deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting subjects assigned to class with ID {classId}.", classId);
                return StatusCode(500, "Internal server error.");
            }
        }
    }
}
