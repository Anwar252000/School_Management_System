using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IInventoryPurchase
    {
        Task<List<InventoryPurchaseDTO>> GetAllInventoryPurchasesAsync();
        Task<InventoryPurchaseDTO> GetInventoryPurchaseByIdAsync(int purchaseId);
        Task AddInventoryPurchaseAsync(InventoryPurchaseDTO purchase);
        Task UpdateInventoryPurchaseAsync(InventoryPurchaseDTO purchase);
        Task DeleteInventoryPurchaseAsync(int purchaseId);
    }
}
