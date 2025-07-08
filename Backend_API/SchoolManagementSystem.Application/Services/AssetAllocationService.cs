using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;
using SchoolManagementSystem.Infrastructure.Data;

namespace SchoolManagementSystem.Application.Services
{
    public class AssetAllocationService : IAssetAllocation
    {
        private readonly IGenericRepository<AssetAllocation> _assetAllocationRepository;
        private readonly IGenericRepository<InventoryStock> _inventoryStockRepository;
        private readonly AssetAllocationMapper _mapper;
        private readonly SchoolContext _dbContext;

        public AssetAllocationService(
            IGenericRepository<AssetAllocation> genericRepository,
            IGenericRepository<InventoryStock> inventoryStockRepository,
            AssetAllocationMapper assetsMapper,
            SchoolContext dbContext
            )
        {
            _assetAllocationRepository = genericRepository;
            _inventoryStockRepository = inventoryStockRepository;
            _mapper = assetsMapper;
            _dbContext = dbContext;
        }

        public async Task AllocateAssetAsync(AssetAllocationDTO dto)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();

            try
            {
                var model = _mapper.MapToEntity(dto);
                await _assetAllocationRepository.AddAsync(model);

                var stockData = new InventoryStock
                {
                    ItemId = dto.ItemId,
                    Quantity = dto.Quantity,
                    StatusId = dto.StatusId,
                    Remarks = "Allocated To " + dto.AllocatedLocation,
                    TransactionType = "OUT",
                    TransactionDate = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = dto.CreatedBy,
                    IsActive = true,
                };

                await _inventoryStockRepository.AddAsync(stockData);

                // Call the stored procedure to generate tag numbers
                await _dbContext.Database.ExecuteSqlRawAsync(
                    "EXEC UpdateItemStatus @p0, @p1, @p2, @p3",
                    model.ItemId, model.StatusId, model.Quantity, model.UpdatedBy
                );

                // Commit transaction if everything is successful
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync(); // Rollback on error
                throw;
            }
        }

        public async Task DeleteAllocatedAssetAsync(int allocationId)
        {
            var allocatedAsset = await _assetAllocationRepository.GetByIdAsync(allocationId);
            if (allocatedAsset != null)
            {
                allocatedAsset.IsActive = false;
                await _assetAllocationRepository.UpdateAsync(allocatedAsset);
            }
        }

        public async Task<List<AssetAllocationDTO>> GetAllAllocatedAssetsAsync()
        {
            var allocatedAsset = await _assetAllocationRepository.GetAllAsync(
                include: query => query
                .Include(x => x.InventoryItems)
                .Include(x => x.InventoryStatuses)
                .Include(x => x.Users)
                );
            var list = allocatedAsset.Select(_mapper.MapToDto).ToList();
            return list;
        }

        public async Task UpdateAllocatedAssetAsync(AssetAllocationDTO dto)
        {
            var existingEntity = await _assetAllocationRepository.GetByIdAsync(dto.AllocationId);

            if (existingEntity == null)
            {
                throw new KeyNotFoundException("Allocated Asset not found.");
            }

            var result = _mapper.MapToEntity(dto);
            result.CreatedAt = existingEntity.CreatedAt;
            result.CreatedBy = existingEntity.CreatedBy;
            result.UpdatedAt = DateTime.UtcNow;
            await _assetAllocationRepository.UpdateAsync(result, true);
        }

    }
}
