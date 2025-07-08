using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class ParentService : IParent
    {
        private readonly IGenericRepository<Parent> _parentRepository;
        private readonly ParentMapper _mapper;


        public ParentService(IGenericRepository<Parent> genericRepository, ParentMapper parentMapper)
        {
            _parentRepository = genericRepository;
            _mapper = parentMapper;

        }

        public async Task AddParentAsync(ParentDTO dto)
        {
            try
            {
                var model = _mapper.MapToEntity(dto);
                await _parentRepository.AddAsync(model);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteParentAsync(int parentId)
        {
            var parents = await _parentRepository.GetByIdAsync(parentId);
            if (parents != null)
            {
                parents.IsActive = false;
                await _parentRepository.UpdateAsync(parents);
            }
        }

        public async Task<List<ParentDTO>> GetAllParentAsync()
        {
            var parents = await _parentRepository.GetAllAsync();
            var activeParents = parents.Where(c => c.IsActive);

            var parentDtos = activeParents.Select(c => _mapper.MapToDto(c)).ToList();
            return parentDtos;
        }

        public async Task UpdateParentAsync(ParentDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _parentRepository.UpdateAsync(model);
        }
    }
}
