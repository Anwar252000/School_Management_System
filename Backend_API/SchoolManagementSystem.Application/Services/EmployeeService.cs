using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class EmployeeService : IEmployee
    {
        private readonly IGenericRepository<Employee> _employeeRepository;
        private readonly EmployeeMapper _mapper;

        public EmployeeService(IGenericRepository<Employee> genericRepository, EmployeeMapper employeeMapper)
        {
            _employeeRepository = genericRepository;
            _mapper = employeeMapper;
        }

        public async Task AddEmployeeAsync(EmployeeDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _employeeRepository.AddAsync(model);
        }

        public async Task DeleteEmployeeAsync(int employeeId)
        {
            var employee = await _employeeRepository.GetByIdAsync(employeeId);
            if (employee != null)
            {
                employee.IsActive = false;
                await _employeeRepository.UpdateAsync(employee);
            }
        }

        public async Task<List<EmployeeDTO>> GetAllEmployeesAsync()
        {
            try
            {
                var employees = await _employeeRepository.GetAllAsync(
                    include: query => query
                        .Include(e => e.EmployeeRole)              // Include EmployeeRole details
                        .Include(e => e.Campus)                    // Include Campus details
                            .ThenInclude(c => c.Departments)       // Include Departments within Campus
                        /*.Include(e => e.Departments)*/               // Include Department details directly
                );

                var activeEmployees = employees.Where(e => e.IsActive).ToList();

                var result = activeEmployees.Select(e => _mapper.MapToDtoWithSubEntity(e)).ToList();
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<EmployeeDTO> GetEmployeeByIdAsync(int employeeId)
        {
           var result = await _employeeRepository.GetByIdAsync(employeeId);
            return _mapper.MapToDto(result);
        }

        public async Task UpdateEmployeeAsync(EmployeeDTO emp)
        {
            var model = _mapper.MapToEntity(emp);
            await _employeeRepository.UpdateAsync(model);
        }
    }
}
