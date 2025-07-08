using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class StudentParentService : IStudentParent
    {
        private readonly IGenericRepository<StudentParent> _studentParentRepository;
        private readonly StudentParentMapper _mapper;


        public StudentParentService(IGenericRepository<StudentParent> genericRepository, StudentParentMapper studentParentMapper)
        {
            _studentParentRepository = genericRepository;
            _mapper = studentParentMapper;

        }

        public async Task AddStudentParentAsync(StudentParentDTO dto)
        {
            try
            {
                var model = _mapper.MapToEntity(dto);
                await _studentParentRepository.AddAsync(model);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteStudentParentAsync(int studentParentId)
        {
            var studentParents = await _studentParentRepository.GetByIdAsync(studentParentId);
            if (studentParents != null)
            {
                studentParents.IsActive = false;
                await _studentParentRepository.UpdateAsync(studentParents);
            }
        }

        public async Task<List<StudentParentDTO>> GetAllStudentParentAsync()
        {
            var studentParents = await _studentParentRepository.GetAllAsync();
            var activeStudentParents = studentParents.Where(c => c.IsActive);

            var studentParentDtos = activeStudentParents.Select(c => _mapper.MapToDto(c)).ToList();
            return studentParentDtos;
        }



        public async Task<List<StudentParentDTO>> GetStudentsByParentIdAsync(int parentId)
        {
            try
            {
                // Fetch students related to the given parentId
                var result = await _studentParentRepository.GetAllAsync(
                    include: query => query
                    .Include(sp => sp.Student)
                    .Include(p => p.Parent)
                    );

                var filter = result.Where(x => x.ParentId == parentId);
                var res = filter.Select(x => _mapper.MapToDto(x)).ToList();

                return res;
            }
            catch (Exception)
            {
                throw;
            }
        }


        public async Task UpdateStudentParentAsync(StudentParentDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _studentParentRepository.UpdateAsync(model);

        }
    }
}
