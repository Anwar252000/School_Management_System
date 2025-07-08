using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class ClassService : IClass
    {
        private readonly IGenericRepository<Class> _classRepository;
        private readonly ClassMapper _mapper;


        public ClassService(IGenericRepository<Class> genericRepository, ClassMapper classMapper)
        {
            _classRepository = genericRepository;
            _mapper = classMapper;
        }

        public async Task AddClassAsync(ClassDto dto)
        {
            try
            {

                var model = _mapper.MapToEntity(dto);
                await _classRepository.AddAsync(model);
            }
            catch (Exception)
            {

                throw;
            }
        }
        public async Task<List<ClassDto>> GetAllClassAsync()
        {
            var classes = await _classRepository.GetAllAsync();
            var activeClasses = classes.Where(c => c.IsActive);

            // Map the entities to DTOs
            var classDtos = activeClasses.Select(c => _mapper.MapToDto(c)).ToList();

            return classDtos;
        }

        public Task<ClassDto> GetClassByIdAsync(int classId)
        {
            throw new NotImplementedException();
        }

        public async Task UpdateClassAsync(ClassDto classes)
        {
            var model = _mapper.MapToEntity(classes);
            await _classRepository.UpdateAsync(model);
        }

        public async Task DeleteClassAsync(int classId)
        {
            var classes = await _classRepository.GetByIdAsync(classId);
            if (classes != null)
            {
                classes.IsActive = false;
                await _classRepository.UpdateAsync(classes);
            }
        }
    }
}
