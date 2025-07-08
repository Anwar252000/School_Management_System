using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IInventoryStocks
    {
        Task<List<InventoryStockViewDTO>> GetAllInventoryStocksAsync();
        Task<List<InventoryStockDTO>> GetInventoryStocksByItemIdAsync(int itemId);
        Task<InventoryStockDTO> GetInventoryStockByIdAsync(int stockId);
        Task AddInventoryStockAsync(InventoryStockDTO stock);
        Task UpdateInventoryStockAsync(InventoryStockDTO stock);
        Task DeleteInventoryStockAsync(int stockId);
    }
}
