using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentAcademicController : ControllerBase
    {
        private readonly IStudentAcademic _studentAcademicService;
        private readonly ILogger<StudentAcademicController> _logger;

        public StudentAcademicController(ILogger<StudentAcademicController> logger, IStudentAcademic studentAcademic)
        {
            _logger = logger;
            _studentAcademicService = studentAcademic;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<StudentAcademicDTO>>> GetStudentAcademic()
        {
            _logger.LogInformation("Fetching all students academics record.");
            try
            {
                var students = await _studentAcademicService.GetAllStudentAcademicAsync();
                _logger.LogInformation("Successfully retrieved {Count} students academic record.", students?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<StudentAcademicDTO>>.SuccessResponse(students, "students academic retrieved successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all students academic.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<StudentAcademicDTO>> GetStudentAcademicById(int id)
        {
            _logger.LogInformation("Fetching student academic with ID {StudentName}.", id);
            try
            {
                var student = await _studentAcademicService.GetStudentAcademicByIdAsync(id);
                if (student == null)
                {
                    _logger.LogWarning("Student academic with ID {StudentAcademicId} not found.", id);
                    return NotFound();
                }

                _logger.LogInformation("Successfully retrieved student Academic with ID {StudentAcademicId}.", id);
                return Ok(student);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching student Academic with ID {StudentAcademicId}.", id);
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<StudentAcademicDTO>> AddStudentAcademic(StudentAcademicDTO student)
        {
            _logger.LogInformation("Adding a new student Academic ", student);
            try
            {
                await _studentAcademicService.AddStudentAcademicAsync(student);
                _logger.LogInformation("Successfully added student Academic with ID {StudentAcademicId}.", student.StudentAcademicId);
                return Ok(ApiResponse<StudentAcademicDTO>.SuccessResponse(student, "Student Academic Added Successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new student Academic.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<StudentAcademicDTO>> PromoteStudentAcademic(StudentAcademicDTO student)
        {
            _logger.LogInformation("Adding a new student Academic ", student);
            try
            {
                await _studentAcademicService.PromoteStudentAcademicAsync(student);
                _logger.LogInformation("Successfully added student Academic with ID {StudentAcademicId}.", student.StudentAcademicId);
                return Ok(ApiResponse<StudentAcademicDTO>.SuccessResponse(student, "Student Academic Added Successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new student Academic.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteStudentAcademic(int studentAcademicId)
        {
            _logger.LogInformation("Deleting student with ID {StudentAcademicId}.", studentAcademicId);
            try
            {
                await _studentAcademicService.DeleteStudentAcademicAsync(studentAcademicId);
                _logger.LogInformation("Successfully deleted student Academic with ID {StudentAcademicId}.", studentAcademicId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Student Academic deleted successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting student Academic with ID {StudentAcademicId}.", studentAcademicId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));

            }
        }
        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateStudentAcademic([FromBody] StudentAcademicDTO dto)
        {
            _logger.LogInformation("Updating Student Academic with ID {StudentAcademicId}.", dto.StudentAcademicId);
            try
            {
                await _studentAcademicService.UpdateStudentAcademicAsync(dto);
                _logger.LogInformation("Successfully updated Student Academic with ID {StudentAcademicId}.", dto.StudentAcademicId);
                return Ok(ApiResponse<StudentAcademicDTO>.SuccessResponse(dto, "Student Academic updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating Student Academic with ID {StudentAcademicId}.", dto.StudentAcademicId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<StudentAcademicDTO>>> GetPromotedStudentByClass(int classId, string? date)
        {
            _logger.LogInformation("Fetching promoted students for Class ID {ClassId} and Date {Date}.", classId, date);

            try
            {
                var results = await _studentAcademicService.GetPromotedStudentByClass(classId, date);

                if (results == null) // Ensure it's checking for an empty list
                {
                    _logger.LogWarning("No promoted students found for Class ID {ClassId} and Date {Date}.", classId, date);
                    return NotFound(ApiResponse<object>.ErrorResponse("No Student records found for the specified class and date."));
                }

                _logger.LogInformation("Successfully retrieved {Count} promoted students.", results);

                return Ok(ApiResponse<IEnumerable<StudentAcademicDTO>>.SuccessResponse(results, "Students academic retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching students for Class ID {ClassId} and Date {Date}.", classId, date);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }


    }
}
