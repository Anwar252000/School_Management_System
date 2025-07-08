using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentsController : ControllerBase
    {
        private readonly IStudent _studentService;
        private readonly ILogger<StudentsController> _logger;

        public StudentsController(ILogger<StudentsController> logger, IStudent student)
        {
            _logger = logger;
            _studentService = student;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            _logger.LogInformation("Fetching all students.");
            try
            {
                var students = await _studentService.GetAllStudentAsync();
                _logger.LogInformation("Successfully retrieved {Count} students.", students?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<Student>>.SuccessResponse(students, "students retrieved successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all students.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet("[action]")]

        public async Task<ActionResult<IEnumerable<StudentDTO>>> GetStudentsClassWise(int classId)
        {
            _logger.LogInformation("Fetching all students.");
            try
            {
                var students = await _studentService.GetAllStudentClassWiseAsync(classId);
                _logger.LogInformation("Successfully retrieved {Count} students.", students?.Count() ?? 0);
                return Ok(ApiResponse<IEnumerable<StudentDTO>>.SuccessResponse(students, "student with class retrieved successfully"));


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all students.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StudentDTO>> GetStudent(int id)
        {
            _logger.LogInformation("Fetching student with ID {StudentId}.", id);
            try
            {
                var student = await _studentService.GetStudentByIdAsync(id);
                if (student == null)
                {
                    _logger.LogWarning("Student with ID {StudentId} not found.", id);
                    return NotFound();
                }

                _logger.LogInformation("Successfully retrieved student with ID {StudentId}.", id);
                return Ok(student);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching student with ID {StudentId}.", id);
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetAllStudentByClassAndSectionAsync(int? classId, int? sectionId)
        {
            _logger.LogInformation("Fetching attendance for Class ID {ClassId} and Section ID {SectionId}.", classId, sectionId);
            try
            {
                var Records = await _studentService.GetAllStudentByClassAndSectionAsync(classId, sectionId);
                if (Records == null)
                {
                    _logger.LogWarning("No Student records found for Class ID {ClassId} and Section ID {SectionId}.", classId, sectionId);
                    return NotFound(ApiResponse<object>.ErrorResponse("No Student records found for the specified class and section."));
                }

                _logger.LogInformation("Successfully retrieved Student records for Class ID {ClassId} and Section ID {SectionId}.", classId, sectionId);
                return Ok(ApiResponse<IEnumerable<StudentDTO>>.SuccessResponse(Records, "Student records retrieved successfully."));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching Student for Class ID {ClassId} and Section ID {SectionId}.", classId, sectionId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }










        [HttpPost]
        public async Task<ActionResult<Student>> AddStudent(Student student)
        {
            _logger.LogInformation("Adding a new student with name {FirstName} {LastName}.", student.FirstName, student.LastName);
            try
            {
                await _studentService.AddStudentAsync(student);
                _logger.LogInformation("Successfully added student with ID {StudentId}.", student.StudentId);
                return CreatedAtAction(nameof(GetStudent), new { id = student.StudentId }, student);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new student.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<StudentDTO>>> GetAllStudents()
        {
            _logger.LogInformation("Fetching all students.");
            try
            {
                var students = await _studentService.GetAllStudentsAsync();
                _logger.LogInformation("Successfully retrieved {Count} students.", students?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<StudentDTO>>.SuccessResponse(students, "students retrieved successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all students.");
                return StatusCode(500, "Internal server error.");
            }
        }



        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteStudent(int studentId)
        {
            _logger.LogInformation("Deleting student with ID {StudentId}.", studentId);
            try
            {
                await _studentService.DeleteStudentAsync(studentId);
                _logger.LogInformation("Successfully deleted student with ID {StudentId}.", studentId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Student deleted successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting student with ID {StudentId}.", studentId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));

            }
        }




        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateStudentData([FromBody] StudentDTO std)
        {
            _logger.LogInformation("Updating Student with ID {StudentId}.", std.StudentId);
            try
            {
                await _studentService.UpdateStudentDataAsync(std);
                _logger.LogInformation("Successfully updated Student with ID {StudentId}.", std.StudentId);
                return Ok(ApiResponse<StudentDTO>.SuccessResponse(std, "Student updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating Student with ID {StudentId}.", std.StudentId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }


    }
}
