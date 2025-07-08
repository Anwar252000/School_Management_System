using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Entities.Fee;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class ClassFeeService : IClassFee
    {
        private readonly IGenericRepository<ClassFee> _classFeeRepository;
        private readonly ClassFeeMapper _mapper;


        public ClassFeeService(IGenericRepository<ClassFee> genericRepository, ClassFeeMapper classFeeMapper)
        {
            _classFeeRepository = genericRepository;
            _mapper = classFeeMapper;

        }

        public async Task AddClassFeeAsync(ClassFeeDTO classFee)
        {
            try
            {
                var model = _mapper.MapToEntity(classFee);
                await _classFeeRepository.AddAsync(model);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteClassFeeAsync(int classFeeId)
        {
            var classFee = await _classFeeRepository.GetByIdAsync(classFeeId);
            if (classFee != null)
            {
                classFee.IsActive = false;
                await _classFeeRepository.UpdateAsync(classFee);
            }
        }

        public async Task<List<ClassFeeDTO>> GetAllClassFeeAsync()
        {
            try
            {
                var classFee = await _classFeeRepository.GetAllAsync(
                     include: query => query
                    .Include(a => a.Campus)
                    .Include(a => a.Class)
                    .Include(c => c.FeeCategory)
                    );
                var activeClassFee = classFee.Where(c => c.IsActive);

                // Map the entities to DTOs
                var classFeeDtos = activeClassFee.Select(c => _mapper.MapToDto(c)).ToList();

                return classFeeDtos;
            }
            catch (Exception)
            {

                throw;
            }

        }

        public async Task<ClassFeeDTO> GetClassFeeByIdAsync(int? classFeeId)
        {
            var response = await _classFeeRepository.GetByIdAsync((int)classFeeId);
            return _mapper.MapToDto(response);
        }

        public async Task UpdateClassFeeAsync(ClassFeeDTO classFee)
        {
            var response = await _classFeeRepository.GetByIdAsync(classFee.ClassFeeId);

            var updatedEntity = _mapper.MapDtoToEntity(classFee, response);

            await _classFeeRepository.UpdateAsync(updatedEntity);
        }
    }
}
