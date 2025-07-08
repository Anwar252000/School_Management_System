using SchoolManagementSystem.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IEmployeeLeave
    {
        Task<List<EmployeeLeaveDTO>> GetAllEmployeeLeaveAsync();
        //Task<EmployeeLeaveDTO> GetEmployeeLeaveByIdAsync(int employeeLeaveId);
        Task AddEmployeeLeaveAsync(EmployeeLeaveDTO empLeave);
        Task UpdateEmployeeLeaveAsync(EmployeeLeaveDTO empLeave);
        Task DeleteEmployeeLeaveAsync(int employeeLeaveId);


    }
}
