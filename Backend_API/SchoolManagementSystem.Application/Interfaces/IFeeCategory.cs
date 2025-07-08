using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IFeeCategory
    {
        Task<List<FeeCategoryDTO>> GetAllFeeCategoriesAsync();
        Task<FeeCategoryDTO> GetFeeCategoryByIdAsync(int feeCategoryId);
        Task AddFeeCategoryAsync(FeeCategoryDTO feeCategory);
        Task UpdateFeeCategoryAsync(FeeCategoryDTO feeCategory);
        Task DeleteFeeCategoryAsync(int feeCategoryId);
    }
}
