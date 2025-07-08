using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class InventoryPurchaseService : IInventoryPurchase
    {
        private readonly IGenericRepository<InventoryPurchase> _inventoryPurchaseRepository;
        private readonly InventoryPurchaseMapper _mapper;

        public InventoryPurchaseService(IGenericRepository<InventoryPurchase> genericRepository, InventoryPurchaseMapper purchaseMapper)
        {
            _inventoryPurchaseRepository = genericRepository;
            _mapper = purchaseMapper;
        }

        public async Task AddInventoryPurchaseAsync(InventoryPurchaseDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _inventoryPurchaseRepository.AddAsync(model);
        }

        public async Task DeleteInventoryPurchaseAsync(int purchaseId)
        {
            var inventoryPurchase = await _inventoryPurchaseRepository.GetByIdAsync(purchaseId);
            if (inventoryPurchase != null)
            {
                inventoryPurchase.IsActive = false;
                await _inventoryPurchaseRepository.UpdateAsync(inventoryPurchase);
            }
        }

        public async Task<List<InventoryPurchaseDTO>> GetAllInventoryPurchasesAsync()
        {
            var existingPurchases = await _inventoryPurchaseRepository.GetAllAsync(
                include: query => query
                        .Include(e => e.InventoryItems)
                );
            var activeInventoryPurchase = existingPurchases.Where(c => c.IsActive).ToList();

            var lst = activeInventoryPurchase.Select(_mapper.MapToDto).ToList();


            return lst;
        }

        public async Task<InventoryPurchaseDTO> GetInventoryPurchaseByIdAsync(int purchaseId)
        {
            var response = await _inventoryPurchaseRepository.GetByIdAsync(purchaseId);
            return _mapper.MapToDto(response);
        }

        public async Task UpdateInventoryPurchaseAsync(InventoryPurchaseDTO dto)
        {
            var existingEntity = await _inventoryPurchaseRepository.GetByIdAsync(dto.PurchaseId);

            if (existingEntity == null)
            {
                throw new KeyNotFoundException("Inventory purchase not found.");
            }

            var result = _mapper.MapToEntity(dto);
            result.UpdatedAt = DateTime.UtcNow;
            result.CreatedBy = existingEntity.CreatedBy;
            await _inventoryPurchaseRepository.UpdateAsync(result, true);
        }

    }
}
