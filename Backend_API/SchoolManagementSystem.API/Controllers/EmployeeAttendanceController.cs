using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeAttendanceController : ControllerBase
    {

        private readonly IEmployeeAttendance _employeeAttendanceService;
        private readonly ILogger<EmployeeAttendanceController> _logger;

        public EmployeeAttendanceController(ILogger<EmployeeAttendanceController> logger, IEmployeeAttendance employeeAttendance)
        {
            _logger = logger;
            _employeeAttendanceService = employeeAttendance;
        }
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<EmployeeAttendanceDTO>>> GetEmployeeAttendance()
        {
            _logger.LogInformation("Fetching all Employee Attendace.");
            try
            {
                var empAttendance = await _employeeAttendanceService.GetAllEmployeeAttendanceAsync();
                _logger.LogInformation("Successfully retrieved Employee Attendance.", empAttendance?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<EmployeeAttendanceDTO>>.SuccessResponse(empAttendance, "Employee Attendance  retrieved successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all Employee Attendance.");
                return StatusCode(500, ApiResponse<IEnumerable<StudentAttendanceDTO>>.ErrorResponse("Internal server error."));

            }
        }


        [HttpGet("[action]")]
        public async Task<IActionResult> GetEmployeeAttendanceByDate(DateOnly attendanceDate)
        {
            _logger.LogInformation("Fetching attendance for Date {AttendanceDate}.", attendanceDate);
            try
            {
                var attendanceRecords = await _employeeAttendanceService.GetEmployeeAttendanceByDate(attendanceDate);
                if (attendanceRecords == null)
                {
                    _employeeAttendanceService.GetEmployeeAttendanceByDate(attendanceDate);
                    return NotFound(ApiResponse<object>.ErrorResponse("No attendance records found for the specified."));
                }

                _employeeAttendanceService.GetEmployeeAttendanceByDate(attendanceDate);
                return Ok(ApiResponse<IEnumerable<EmployeeAttendanceDTO>>.SuccessResponse(attendanceRecords, "Attendance records retrieved successfully."));
            }
            catch (Exception ex)
            {
                _logger.LogError("Fetching attendance for Date {AttendanceDate}.", attendanceDate);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPost("[action]")]

        public async Task<ActionResult<ApiResponse<EmployeeAttendance>>> AddEmployeeAttendance([FromBody] List<EmployeeAttendanceDTO> employeeAttendanceDtos)
        {

            try
            {
                foreach (var employee in employeeAttendanceDtos)
                {
                    _logger.LogInformation("Adding a new attendance with name {EmployeeName}.", employee.EmployeeAttendanceId);
                    await _employeeAttendanceService.AddEmployeeAttendanceAsync(employee);
                    _logger.LogInformation("Successfully added Employee Attendance with ID {EmployeeAttendanceId}.", employee.EmployeeAttendanceId);
                }

                return Ok(ApiResponse<List<EmployeeAttendanceDTO>>.SuccessResponse(employeeAttendanceDtos, "Attendance Added successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new Employee Attendance.");
                return StatusCode(500, "Internal server error.");
            }
        }
        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateEmployeeAttandance(EmployeeAttendanceDTO dto)
        {
            _logger.LogInformation("Updating Attendance with ID {EmployeeAttendanceId}.", dto.EmployeeAttendanceId);
            try
            {
                await _employeeAttendanceService.UpdateEmployeeAttendanceAsync(dto);
                _logger.LogInformation("Successfully Updated Employee Attendance with ID {attendanceId}.", dto.EmployeeAttendanceId);
                return Ok(ApiResponse<EmployeeAttendanceDTO>.SuccessResponse(dto, "Attendance updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating {EmployeeAttendanceId}.", dto.EmployeeAttendanceId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteEmployeeAttendance(int attendanceId)
        {

            _logger.LogInformation("Deleting Attendance with ID {attendanceId}.", attendanceId);
            try
            {
                await _employeeAttendanceService.DeleteEmployeeAttendanceAsync(attendanceId);
                _logger.LogInformation("Successfully deleted Employee Attendance with ID {attendanceId}.", attendanceId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "attendance deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting Employee Attendance with ID {attendanceId}.", attendanceId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }

        }
    }
}
