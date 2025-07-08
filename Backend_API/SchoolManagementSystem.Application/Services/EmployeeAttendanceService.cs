using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class EmployeeAttendanceService : IEmployeeAttendance
    {
        private readonly IGenericRepository<EmployeeAttendance> _employeeAttendanceRepository;
        private readonly EmployeeAttendanceMapper _mapper;

        public EmployeeAttendanceService(IGenericRepository<EmployeeAttendance> genericRepository, EmployeeAttendanceMapper mapper)
        {
            _employeeAttendanceRepository = genericRepository;
            _mapper = mapper;
        }

        public async Task AddEmployeeAttendanceAsync(EmployeeAttendanceDTO dto)
        {
            try
            {
                var model = _mapper.MapToEntity(dto);
                object value = await _employeeAttendanceRepository.AddAsync(model);
            }
            catch (Exception)
            {

                throw;
            }
        }


        public async Task DeleteEmployeeAttendanceAsync(int empAttendanceId)
        {
            //var employeeAttendance = await _employeeAttendanceRepository.GetByIdAsync(attendanceId);
            //if (employeeAttendance != null)
            //{
            //    employeeAttendance.IsActive = false;
            //    await _employeeAttendanceRepository.UpdateAsync(employeeAttendance);
            //}
            throw new NotImplementedException();
        }

        public async Task<List<EmployeeAttendanceDTO>> GetAllEmployeeAttendanceAsync()
        {

            try
            {
                var employeeAttendance = await _employeeAttendanceRepository.GetAllAsync(
                    include: query => query
                    .Include(s => s.Employee)
                    //.Include(c => c.Campus)


                    );
                var activeEmployeeAttendance = employeeAttendance.Where(c => c.IsActive);
                var employeeAttendanceDtos = activeEmployeeAttendance.Select(c => _mapper.MapToDto(c)).ToList();
                return employeeAttendanceDtos;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<List<EmployeeAttendanceDTO>> GetEmployeeAttendanceByDate(DateOnly attendanceDate)
        {
            try
            {
                var employeeAttendance = await _employeeAttendanceRepository.GetAllAsync(
                    filter: a =>
                        a.IsActive &&
                        (a.AttendanceDate == attendanceDate)
                        ,
                    include: query => query
                        .Include(s => s.Employee)
                //.Include(c => c.Campus)
                );

                var employeeAttendanceDtos = employeeAttendance
                    .Select(a => _mapper.MapToDto(a))
                    .ToList();

                return employeeAttendanceDtos;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while fetching attendance records.", ex);
            }


            //throw new NotImplementedException();
        }


        public async Task<EmployeeAttendanceDTO> GetEmployeeAttendanceByIdAsync(int empId)
        {
            throw new NotImplementedException();

        }

        public async Task UpdateEmployeeAttendanceAsync(EmployeeAttendanceDTO dto)
        {
            //var model = _mapper.MapToEntity(dto);
            //await _employeeAttendanceRepository.UpdateAsync(model);
            throw new NotImplementedException();
        }
    }
}