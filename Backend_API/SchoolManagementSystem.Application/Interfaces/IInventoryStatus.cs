using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IInventoryStatus
    {
        Task<List<InventoryStatusDTO>> GetAllInventoryStatusAsync();
        Task<InventoryStatusDTO> GetInventoryStatusByIdAsync(int statusId);
        Task AddInventoryStatusAsync(InventoryStatusDTO status);
        Task UpdateInventoryStatusAsync(InventoryStatusDTO status);
        Task DeleteInventoryStatusAsync(int statusId);
    }
}
