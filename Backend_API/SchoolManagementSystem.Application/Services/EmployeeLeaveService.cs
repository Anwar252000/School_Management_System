using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolManagementSystem.Application.Services
{

    public class EmployeeLeaveService : IEmployeeLeave
    {
        private readonly IGenericRepository<EmployeeLeave> _employeeleaveRepository;
        private readonly EmployeeLeaveMapper _mapper;

        public EmployeeLeaveService(IGenericRepository<EmployeeLeave> genericRepository, EmployeeLeaveMapper employeeleaveMapper)
        {
            _employeeleaveRepository = genericRepository;
            _mapper = employeeleaveMapper;
        }

        public async Task AddEmployeeLeaveAsync(EmployeeLeaveDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _employeeleaveRepository.AddAsync(model);
        }

        public async Task DeleteEmployeeLeaveAsync(int empLeaveId)
        {
            var employeeLeave = await _employeeleaveRepository.GetByIdAsync(empLeaveId);
            if (employeeLeave != null)
            {
                employeeLeave.IsActive = false;
                await _employeeleaveRepository.UpdateAsync(employeeLeave);
            }

        }


        public async Task<List<EmployeeLeaveDTO>> GetAllEmployeeLeaveAsync()
        {
            try
            {
                var employeesleave = await _employeeleaveRepository.GetAllAsync(
                    include: query => query
                    .Include(e => e.Employees)
                    );

                var activeEmployeesleave = employeesleave.Where(e => e.IsActive).ToList();

                var result = activeEmployeesleave

                    .Select(e => _mapper.MapToDto(e)).ToList();
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task UpdateEmployeeLeaveAsync(EmployeeLeaveDTO role)
        {
            try
            {
                var model = _mapper.MapToEntity(role);
                await _employeeleaveRepository.UpdateAsync(model);
            }
            catch (Exception)
            {

                throw;
            }

        }

    }
}