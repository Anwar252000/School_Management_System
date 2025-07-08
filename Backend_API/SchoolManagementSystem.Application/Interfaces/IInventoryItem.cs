using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IInventoryItems
    {
        Task<List<InventoryItemDTO>> GetAllInventoryItemsAsync();
        Task<List<ItemDetailDTO>> GetItemDetailsByItemIdAsync(int itemId);
        Task<InventoryItemDTO> GetInventoryItemByIdAsync(int itemId);
        Task AddInventoryItemAsync(InventoryItemDTO item);
        Task UpdateInventoryItemAsync(InventoryItemDTO item);
        Task UpdateItemDetailStatusAsync(ItemDetailDTO item);
        Task DeleteInventoryItemAsync(int itemId);
    }
}
