using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IEmployee
    {
        Task<List<EmployeeDTO>> GetAllEmployeesAsync();
        Task<EmployeeDTO> GetEmployeeByIdAsync(int employeeId);
        Task AddEmployeeAsync(EmployeeDTO emp);
        Task UpdateEmployeeAsync(EmployeeDTO emp);
        Task DeleteEmployeeAsync(int employeeId);

    }
}
