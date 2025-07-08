using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class InventoryStatusService : IInventoryStatus
    {
        private readonly IGenericRepository<InventoryStatus> _inventoryStatusRepository;
        private readonly InventoryStatusMapper _mapper;

        public InventoryStatusService(
            IGenericRepository<InventoryStatus> genericRepository, 
            InventoryStatusMapper statusMapper
            )
        {
            _inventoryStatusRepository = genericRepository;
            _mapper = statusMapper;
        }

        public async Task AddInventoryStatusAsync(InventoryStatusDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _inventoryStatusRepository.AddAsync(model);
        }

        public async Task DeleteInventoryStatusAsync(int stockId)
        {
            var inventoryStatus = await _inventoryStatusRepository.GetByIdAsync(stockId);
            if (inventoryStatus != null)
            {
                inventoryStatus.IsActive = false;
                await _inventoryStatusRepository.UpdateAsync(inventoryStatus);
            }
        }

        public async Task<List<InventoryStatusDTO>> GetAllInventoryStatusAsync()
        {
            var inventoryStatus = await _inventoryStatusRepository.GetAllAsync(x => x.IsActive);
            var list = inventoryStatus.Select(_mapper.MapToDto).ToList();
            return list;
        }

        public async Task<InventoryStatusDTO> GetInventoryStatusByIdAsync(int stockId)
        {
            var response = await _inventoryStatusRepository.GetByIdAsync(stockId);
            return _mapper.MapToDto(response);
        }

        public async Task UpdateInventoryStatusAsync(InventoryStatusDTO dto)
        {
            var existingEntity = await _inventoryStatusRepository.GetByIdAsync(dto.StatusId);

            if (existingEntity == null)
            {
                throw new KeyNotFoundException("Inventory Status not found.");
            }

            var result = _mapper.MapToEntity(dto);
            result.CreatedAt = existingEntity.CreatedAt;
            result.CreatedBy = existingEntity.CreatedBy;
            result.UpdatedAt = DateTime.UtcNow;
            await _inventoryStatusRepository.UpdateAsync(result, true);
        }

    }
}
