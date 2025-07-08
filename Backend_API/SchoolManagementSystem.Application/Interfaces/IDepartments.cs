using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IDepartments
    {
        Task<List<Department>> GetAllDepartmentsAsync();
        Task<List<DepartmentDTO>> GetAllDepartmentsWithCampusAsync(int id);
        Task<Department> GetDepartmentByIdAsync(int departmentId);
        Task AddDepartmentAsync(DepartmentDTO department);
        Task UpdateDepartmentAsync(DepartmentDTO department);
        Task DeleteDepartmentAsync(int departmentId);
    }
}
