using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentAttendanceController : ControllerBase
    {

        private readonly IStudentAttendance _studentAttendanceService;
        private readonly ILogger<StudentAttendanceController> _logger;

        public StudentAttendanceController(ILogger<StudentAttendanceController> logger, IStudentAttendance studentAttendance)
        {
            _logger = logger;
            _studentAttendanceService = studentAttendance;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<StudentAttendanceDTO>>> GetStudentAttendance()
        {
            _logger.LogInformation("Fetching all student Attendace.");
            try
            {
                var stdAttendance = await _studentAttendanceService.GetAllStudentsAttendanceAsync();
                _logger.LogInformation("Successfully retrieved studentAttendance.", stdAttendance?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<StudentAttendanceDTO>>.SuccessResponse(stdAttendance, "Student Attendance  retrieved successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all student Attendance.");
                return StatusCode(500, ApiResponse<IEnumerable<StudentAttendanceDTO>>.ErrorResponse("Internal server error."));

            }
        }


        [HttpGet("[action]")]
        public async Task<IActionResult> GetStudentAttendanceByClassSectionId(int classId, int sectionId, DateOnly attendanceDate)
        {
            _logger.LogInformation("Fetching attendance for Class ID {ClassId} and Section ID {SectionId} and Date {AttendanceDate}.", classId, sectionId, attendanceDate);
            try
            {
                var attendanceRecords = await _studentAttendanceService.GetStudentAttendanceByClassSectionId(classId, sectionId, attendanceDate);
                if (attendanceRecords == null)
                {
                    _logger.LogWarning("No attendance records found for Class ID {ClassId} and Section ID {SectionId}.", classId, sectionId);
                    return NotFound(ApiResponse<object>.ErrorResponse("No attendance records found for the specified class and section."));
                }

                _logger.LogInformation("Successfully retrieved attendance records for Class ID {ClassId} and Section ID {SectionId}.", classId, sectionId);
                return Ok(ApiResponse<IEnumerable<StudentAttendanceDTO>>.SuccessResponse(attendanceRecords, "Attendance records retrieved successfully."));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching attendance for Class ID {ClassId} and Section ID {SectionId}.", classId, sectionId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPost("[action]")]

        public async Task<ActionResult<ApiResponse<StudentAttendance>>> AddStudentAttendance([FromBody] List<StudentAttendanceDTO> studentAttendanceDtos)
        {

            try
            {
                foreach (var student in studentAttendanceDtos)
                {
                    _logger.LogInformation("Adding a new attendance with name {StudentName}.", student.StudentId);
                    await _studentAttendanceService.AddStudentAttendanceAsync(student);
                    _logger.LogInformation("Successfully added Student Attendance with ID {attendanceId}.", student.AttendanceId);
                }

                return Ok(ApiResponse<List<StudentAttendanceDTO>>.SuccessResponse(studentAttendanceDtos, "Attendance Added successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new student Attendance.");
                return StatusCode(500, "Internal server error.");
            }
        }
        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateStudentAttandance(StudentAttendanceDTO dto)
        {
            _logger.LogInformation("Updating Attendance with ID {AttendanceId}.", dto.AttendanceId);
            try
            {
                await _studentAttendanceService.UpdateStudentAttendanceAsync(dto);
                _logger.LogInformation("Successfully updated Attendance with ID {attendanceId}.", dto.AttendanceId);
                return Ok(ApiResponse<StudentAttendanceDTO>.SuccessResponse(dto, "Attendance updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating Class with ID {attendanceId}.", dto.AttendanceId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteStudentAttendance(int attendanceId)
        {

            _logger.LogInformation("Deleting Attendance with ID {attendanceId}.", attendanceId);
            try
            {
                await _studentAttendanceService.DeleteStudentAttendanceAsync(attendanceId);
                _logger.LogInformation("Successfully deleted Student Attendance with ID {attendanceId}.", attendanceId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "attendance deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting Student Attendance with ID {attendanceId}.", attendanceId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }

        }
    }
}
