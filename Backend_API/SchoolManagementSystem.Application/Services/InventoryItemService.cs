using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;
using SchoolManagementSystem.Infrastructure.Data;

namespace SchoolManagementSystem.Application.Services
{
    public class InventoryItemService : IInventoryItems
    {
        private readonly IGenericRepository<InventoryItem> _inventoryItemRepository;
        private readonly InventoryItemMapper _mapper;
        private readonly IGenericRepository<InventoryStatus> _statusRepository;
        private readonly IGenericRepository<InventoryStock> _stockRepository;
        private readonly IGenericRepository<ItemDetail> _itemDetailRepository;
        private readonly ItemDetailMapper _itemDetailMapper;
        private readonly SchoolContext _dbContext;

        public InventoryItemService(
            IGenericRepository<InventoryItem> genericRepository,
            InventoryItemMapper itemMapper,
            IGenericRepository<InventoryStatus> statusRepository,
            IGenericRepository<InventoryStock> stockRepository,
            IGenericRepository<ItemDetail> itemDetailRepository,
            ItemDetailMapper itemDetailMapper,
            SchoolContext dbContext
            )
        {
            _inventoryItemRepository = genericRepository;
            _mapper = itemMapper;
            _statusRepository = statusRepository;
            _stockRepository = stockRepository;
            _itemDetailRepository = itemDetailRepository;
            _itemDetailMapper = itemDetailMapper;
            _dbContext = dbContext;
        }

        public async Task AddInventoryItemAsync(InventoryItemDTO dto)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();

            try
            {
                var model = _mapper.MapToEntity(dto);
                await _inventoryItemRepository.AddAsync(model);

                var status = await _statusRepository.FindAsync(x => x.StatusName == "In Stock");

                var stockData = new InventoryStock
                {
                    ItemId = model.ItemId,
                    Quantity = model.TotalQuantity,
                    TransactionType = "IN",
                    TransactionDate = DateTime.UtcNow,
                    Remarks = model.Description,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = model.CreatedBy,
                    StatusId = status.StatusId,
                    IsActive = true,
                };
                await _stockRepository.AddAsync(stockData);

                // Call the stored procedure to generate tag numbers
                await _dbContext.Database.ExecuteSqlRawAsync(
                    "EXEC InsertItemDetails @p0, @p1, @p2",
                    model.ItemId, model.TotalQuantity, model.CreatedBy
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


        public async Task DeleteInventoryItemAsync(int itemId)
        {
            var inventoryItem = await _inventoryItemRepository.GetByIdAsync(itemId);
            if (inventoryItem != null)
            {
                inventoryItem.IsActive = false;
                await _inventoryItemRepository.UpdateAsync(inventoryItem);
            }
        }

        public async Task<List<InventoryItemDTO>> GetAllInventoryItemsAsync()
        {
            var inventoryItem = await _inventoryItemRepository.GetAllAsync(
                include: query => query.Include(x => x.InventoryCategories)
                );
            var activeInventoryItem = inventoryItem.Where(c => c.IsActive).ToList();

            var list = activeInventoryItem.Select(_mapper.MapToDto).ToList();
            return list;
        }

        public async Task<InventoryItemDTO> GetInventoryItemByIdAsync(int itemId)
        {
            var response = await _inventoryItemRepository.GetByIdAsync(itemId);
            return _mapper.MapToDto(response);
        }

        public async Task<List<ItemDetailDTO>> GetItemDetailsByItemIdAsync(int itemId)
        {
            try
            {
                var inventoryItems = await _itemDetailRepository.GetAllAsync(
                include: query => query
                .Include(x => x.InventoryStatuses)
                .Include(x => x.InventoryItems)
                .ThenInclude(x => x.InventoryCategories)
                );

                var result = inventoryItems.Where(c => c.ItemId == itemId).ToList();
                var list = result.Select(_itemDetailMapper.MapToDto).ToList();
                return list;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task UpdateInventoryItemAsync(InventoryItemDTO dto)
        {
            var existingEntity = await _inventoryItemRepository.GetByIdAsync(dto.ItemId);

            if (existingEntity == null)
            {
                throw new KeyNotFoundException("Inventory category not found.");
            }

            var result = _mapper.MapToEntity(dto);
            result.CreatedAt = existingEntity.CreatedAt;
            result.CreatedBy = existingEntity.CreatedBy;
            result.UpdatedAt = DateTime.UtcNow;
            await _inventoryItemRepository.UpdateAsync(result, true);
        }

        public async Task UpdateItemDetailStatusAsync(ItemDetailDTO dto)
        {
            var existingEntity = await _itemDetailRepository.GetByIdAsync(dto.ItemDetailId);

            if (existingEntity == null)
            {
                throw new KeyNotFoundException("Item not found.");
            }

            var result = _itemDetailMapper.MapToEntity(dto);
            result.TagNumber = existingEntity.TagNumber;
            result.CreatedAt = existingEntity.CreatedAt;
            result.CreatedBy = existingEntity.CreatedBy;
            result.UpdatedAt = DateTime.UtcNow;
            result.IsActive = existingEntity.IsActive;
            result.ItemId = existingEntity.ItemId;
            await _itemDetailRepository.UpdateAsync(result, true);
        }
    }
}
