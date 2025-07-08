using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Entities.Fee;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class FeeCategoryService : IFeeCategory
    {
        private readonly IGenericRepository<FeeCategory> _feeRepository;
        private readonly FeeCategoryMapper _mapper;

        public FeeCategoryService(IGenericRepository<FeeCategory> genericRepository, FeeCategoryMapper feeCategoryMapper)
        {
            _feeRepository = genericRepository;
            _mapper = feeCategoryMapper;
        }

        public async Task AddFeeCategoryAsync(FeeCategoryDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _feeRepository.AddAsync(model);
        }

        public async Task DeleteFeeCategoryAsync(int feeCategoryId)
        {
            var FeeCategory = await _feeRepository.GetByIdAsync(feeCategoryId);
            if (FeeCategory != null)
            {
                FeeCategory.IsActive = false;
                await _feeRepository.UpdateAsync(FeeCategory);
            }
        }

        public async Task<List<FeeCategoryDTO>> GetAllFeeCategoriesAsync()
        {
            var feeCategories = await _feeRepository.GetAllAsync();
            var activeFeeCategories = feeCategories.ToList();
            var result = activeFeeCategories.Select(e => _mapper.MapToDto(e)).ToList();
            return result;
        }

        public async Task<FeeCategoryDTO> GetFeeCategoryByIdAsync(int feeCategoryId)
        {
            var result = await _feeRepository.GetByIdAsync(feeCategoryId);
            return _mapper.MapToDto(result);
        }

        public async Task UpdateFeeCategoryAsync(FeeCategoryDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _feeRepository.UpdateAsync(model);
        }

    }
}
