using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IAssetAllocation
    {
        Task<List<AssetAllocationDTO>> GetAllAllocatedAssetsAsync();
        Task AllocateAssetAsync(AssetAllocationDTO dto);
        Task UpdateAllocatedAssetAsync(AssetAllocationDTO dto);
        Task DeleteAllocatedAssetAsync(int allocationId);
    }
}
