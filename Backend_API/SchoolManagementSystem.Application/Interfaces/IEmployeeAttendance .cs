using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IEmployeeAttendance
    {

        Task<List<EmployeeAttendanceDTO>> GetAllEmployeeAttendanceAsync();
        Task<EmployeeAttendanceDTO> GetEmployeeAttendanceByIdAsync(int empId);

        Task AddEmployeeAttendanceAsync(EmployeeAttendanceDTO dto);
        Task UpdateEmployeeAttendanceAsync(EmployeeAttendanceDTO dto);
        Task DeleteEmployeeAttendanceAsync(int empAttendanceId);
        Task<List<EmployeeAttendanceDTO>> GetEmployeeAttendanceByDate(DateOnly attendanceDate);

    }
}
