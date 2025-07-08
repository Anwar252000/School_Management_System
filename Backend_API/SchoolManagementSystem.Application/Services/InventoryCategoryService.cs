using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class InventoryCategoryService : IInventoryCategories
    {
        private readonly IGenericRepository<InventoryCategory> _inventoryCategoryRepository;
        private readonly InventoryCategoryMapper _mapper;

        public InventoryCategoryService(IGenericRepository<InventoryCategory> genericRepository, InventoryCategoryMapper categoryMapper)
        {
            _inventoryCategoryRepository = genericRepository;
            _mapper = categoryMapper;
        }

        public async Task AddInventoryCategoryAsync(InventoryCategoryDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _inventoryCategoryRepository.AddAsync(model);
        }

        public async Task DeleteInventoryCategoryAsync(int categoryId)
        {
            var inventoryCategory = await _inventoryCategoryRepository.GetByIdAsync(categoryId);
            if (inventoryCategory != null)
            {
                inventoryCategory.IsActive = false;
                await _inventoryCategoryRepository.UpdateAsync(inventoryCategory);
            }
        }

        public async Task<List<InventoryCategoryDTO>> GetAllInventoryCategoriesAsync()
        {
            var inventoryCategory = await _inventoryCategoryRepository.GetAllAsync();
            var activeInventoryCategory = inventoryCategory.Where(c => c.IsActive).ToList();

            var lst = activeInventoryCategory.Select(_mapper.MapToDto).ToList();


            return lst;
        }

        public async Task<InventoryCategoryDTO> GetInventoryCategoryByIdAsync(int categoryId)
        {
            var response = await _inventoryCategoryRepository.GetByIdAsync(categoryId);
            return _mapper.MapToDto(response);
        }

        public async Task UpdateInventoryCategoryAsync(InventoryCategoryDTO dto)
        {
            var existingEntity = await _inventoryCategoryRepository.GetByIdAsync(dto.CategoryId);

            if (existingEntity == null)
            {
                throw new KeyNotFoundException("Inventory category not found.");
            }

            existingEntity.CategoryName = dto.CategoryName;
            existingEntity.Description = dto.Description;
            existingEntity.UpdatedAt = DateTime.UtcNow;
            existingEntity.UpdatedBy = dto.UpdatedBy;
            await _inventoryCategoryRepository.UpdateAsync(existingEntity);
        }

    }
}
