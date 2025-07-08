using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class ClassroomService : IClassroom
    {
        private readonly IGenericRepository<Classroom> _classroomRepository;
        private readonly ClassroomMapper _mapper;


        public ClassroomService(IGenericRepository<Classroom> genericRepository, ClassroomMapper classroomMapper)
        {
            _classroomRepository = genericRepository;
            _mapper = classroomMapper;

        }

        public async Task AddClassroomAsync(ClassroomDTO clroom)
        {
            try
            {
                var model = _mapper.MapToEntity(clroom);
                await _classroomRepository.AddAsync(model);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteClassroomAsync(int classroomId)
        {
            var classroom = await _classroomRepository.GetByIdAsync(classroomId);
            if (classroom != null)
            {
                classroom.IsActive = false;
                await _classroomRepository.UpdateAsync(classroom);
            }
        }

        public async Task<List<ClassroomDTO>> GetAllClassroomAsync()
        {
            var classrooms = await _classroomRepository.GetAllAsync();
            var activeClassrooms = classrooms.Where(c => c.IsActive);

            // Map the entities to DTOs
            var classroomDtos = activeClassrooms.Select(c => _mapper.MapToDto(c)).ToList();

            return classroomDtos;
        }

        public Task<ClassroomDTO> GetClassroomByIdAsync(int classroomId)
        {
            throw new NotImplementedException();
        }

        public async Task UpdateClassroomAsync(ClassroomDTO clroom)
        {
            var model = _mapper.MapToEntity(clroom);
            
            await _classroomRepository.UpdateAsync(model);
        }
    }
}
