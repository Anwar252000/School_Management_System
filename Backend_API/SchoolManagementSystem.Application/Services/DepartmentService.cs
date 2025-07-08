using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class DepartmentService : IDepartments
    {
        private readonly IGenericRepository<Department> _departmentRepository;
        private readonly DepartmentMapper _mapper;

        public DepartmentService(IGenericRepository<Department> genericRepository, DepartmentMapper departmentMapper)
        {
            _departmentRepository = genericRepository;
            _mapper = departmentMapper;
        }

        public async Task AddDepartmentAsync(DepartmentDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _departmentRepository.AddAsync(model);
        }

        public async Task DeleteDepartmentAsync(int departmentId)
        {
            var department = await _departmentRepository.GetByIdAsync(departmentId);
            if (department != null)
            {
                department.IsActive = false;
                await _departmentRepository.UpdateAsync(department);
            }
        }

        public async Task<List<Department>> GetAllDepartmentsAsync()
        {
            return (await _departmentRepository.GetAllAsync()).ToList();
        }

        public async Task<List<DepartmentDTO>> GetAllDepartmentsWithCampusAsync(int campusId)
        {
            var lst = new List<DepartmentDTO>();
            var response = (await _departmentRepository.GetAllAsync(
                include: q => q.Include(d => d.Campus),
                filter: d => d.CampusId == campusId && d.IsActive == true)).ToList();

            response.ForEach(x => lst.Add(_mapper.MapToDto(x)));

            return lst;
        }


        public async Task<Department> GetDepartmentByIdAsync(int departmentId)
        {
            return await _departmentRepository.GetByIdAsync(departmentId);
        }

        public async Task UpdateDepartmentAsync(DepartmentDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _departmentRepository.UpdateAsync(model);
        }

    }
}
