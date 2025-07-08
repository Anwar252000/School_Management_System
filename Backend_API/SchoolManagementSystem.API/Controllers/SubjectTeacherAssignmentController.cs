using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectTeacherAssignmentController : ControllerBase
    {

        private readonly ISubjectTeacherAssignment _subjectTeacherAssignmentService;
        private readonly ILogger<SubjectTeacherAssignmentController> _logger;

        public SubjectTeacherAssignmentController(ILogger<SubjectTeacherAssignmentController> logger, ISubjectTeacherAssignment subjectTeacherAssignment)
        {
            _logger = logger;
            _subjectTeacherAssignmentService = subjectTeacherAssignment;
        }

        [HttpGet("[action]")]

        public async Task<ActionResult<IEnumerable<SubjectTeacherAssignmentDTO>>> GetAllSubjectTeacherAsync()
        {
            _logger.LogInformation("Fetching all subject assignments.");
            try
            {
                var subjectTeacher = await _subjectTeacherAssignmentService.GetAllSubjectTeacherAsync();
                _logger.LogInformation("Successfully retrieved {Count} subject assignments.", subjectTeacher?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<SubjectTeacherAssignmentDTO>>.SuccessResponse(subjectTeacher, "subject Assignment retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all class assignments.");
                return StatusCode(500, ApiResponse<IEnumerable<SubjectTeacherAssignmentDTO>>.ErrorResponse("Internal server error."));

            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<SubjectTeacherAssignmentDTO>>> AddSubjectTeacher([FromBody] SubjectTeacherAssignmentDTO dto)

        
       {
            _logger.LogInformation("Adding a new subject Teacher with Id {SubjectId} {EmployeeId}.", dto.SubjectId, dto.EmployeeId);
            try
            {
                await _subjectTeacherAssignmentService.AddSubjectTeacherAsync(dto);
                _logger.LogInformation("Adding a new subject Teacher with Id {SubjectId} {EmployeeId}.", dto.SubjectId, dto.EmployeeId);
                return Ok(ApiResponse<SubjectTeacherAssignmentDTO>.SuccessResponse(dto, "Subject Teacher added successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new Subject Teacher.");
                return StatusCode(500, ApiResponse<SubjectTeacherAssignmentDTO>.ErrorResponse("Internal server error."));
            }
        }
        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateSubjectTeacher(SubjectTeacherAssignmentDTO subject)
        {
            _logger.LogInformation("Updating subject taecher Assignment with ID {SubjectTeacherId}.", subject.SubjectTeacherId);
            try
            {
                await _subjectTeacherAssignmentService.UpdateSubjectTeacherAsync(subject);
                _logger.LogInformation("Successfully updated subject Assigning with ID {SubjectTeacherId}.", subject.SubjectTeacherId);
                return Ok(ApiResponse<SubjectTeacherAssignmentDTO>.SuccessResponse(subject, "Subject Assignment updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating subject Assignment with ID {SubjectTeacherId}.", subject.SubjectTeacherId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteSubjectTeacher(int employeeId)
        {
            _logger.LogInformation("Deleting subject teacher Assignment with ID {SubjectTeacherId}.", employeeId);
            try
            {
                await _subjectTeacherAssignmentService.DeleteSubjectTeacherAsync(employeeId);
                _logger.LogInformation("Successfully deleted subject Assignment with ID {SubjectTeacherId}.", employeeId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "subject Assignment deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting subject assignment with ID {SubjectTeacherId}.", employeeId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));

            }
        }

    }
}
