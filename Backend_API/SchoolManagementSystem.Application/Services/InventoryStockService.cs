using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;
using SchoolManagementSystem.Infrastructure.Data;

namespace SchoolManagementSystem.Application.Services
{
    public class InventoryStockService : IInventoryStocks
    {
        private readonly IGenericRepository<InventoryStock> _inventoryStockRepository;
        private readonly InventoryStockMapper _mapper;
        private readonly IGenericRepository<InventoryStockView> _stockView;
        private readonly InventoryStockViewMapper _stockViewMapper;
        private readonly SchoolContext _dbContext;

        public InventoryStockService(
            IGenericRepository<InventoryStock> genericRepository, 
            InventoryStockMapper stockMapper, 
            IGenericRepository<InventoryStockView> stockView,
            InventoryStockViewMapper stockViewMapper,
            SchoolContext dbContext
            )
        {
            _inventoryStockRepository = genericRepository;
            _mapper = stockMapper;
            _stockView = stockView;
            _stockViewMapper = stockViewMapper;
            _dbContext = dbContext;
        }

        public async Task AddInventoryStockAsync(InventoryStockDTO dto)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();

            try
            {
                var model = _mapper.MapToEntity(dto);
                await _inventoryStockRepository.AddAsync(model);

                // Call the stored procedure to generate tag numbers
                await _dbContext.Database.ExecuteSqlRawAsync(
                    "EXEC InsertItemDetails @p0, @p1, @p2",
                    model.ItemId, model.Quantity, model.CreatedBy
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

        public async Task DeleteInventoryStockAsync(int stockId)
        {
            try
            {
                var inventoryStock = await _inventoryStockRepository.GetByIdAsync(stockId);
                if (inventoryStock != null)
                {
                    inventoryStock.IsActive = false;
                    await _inventoryStockRepository.UpdateAsync(inventoryStock);
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<List<InventoryStockViewDTO>> GetAllInventoryStocksAsync()
        {
            try
            {
                var inventoryStock = await _stockView.GetAllAsync();
                var list = inventoryStock.Select(_stockViewMapper.MapToDto).ToList();
                return list;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<List<InventoryStockDTO>> GetInventoryStocksByItemIdAsync(int itemId)
        {
            try
            {
                var inventoryStocks = await _inventoryStockRepository.GetAllAsync(
                    x => x.IsActive,
                    include: query => query
                    .Include(x => x.InventoryStatus)
                    .Include(x => x.InventoryItems)
                    );

                var filteredStocks = inventoryStocks.Where(x => x.ItemId == itemId).ToList();
                var list = filteredStocks.Select(_mapper.MapToDto).ToList();
                return list;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<InventoryStockDTO> GetInventoryStockByIdAsync(int stockId)
        {
            try
            {
                var response = await _inventoryStockRepository.GetByIdAsync(stockId);
                return _mapper.MapToDto(response);
            }
            catch (Exception)
            {

                throw;
            }
        }


        public async Task UpdateInventoryStockAsync(InventoryStockDTO dto)
        {
            try
            {
                var existingEntity = await _inventoryStockRepository.GetByIdAsync(dto.ItemId);

                if (existingEntity == null)
                {
                    throw new KeyNotFoundException("Inventory Stock not found.");
                }

                var result = _mapper.MapToEntity(dto);
                result.CreatedAt = existingEntity.CreatedAt;
                result.CreatedBy = existingEntity.CreatedBy;
                result.UpdatedAt = DateTime.UtcNow;
                await _inventoryStockRepository.UpdateAsync(result);
            }
            catch (Exception)
            {

                throw;
            }
        }

    }
}
