using SchoolManagementSystem.Application.DTOs.Library;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IBookCategory
    {
        Task<List<BookCategoryDTO>> GetAllCategoryAsync();
        Task AddCategoryAsync(BookCategoryDTO dto);
        Task UpdateCategoryAsync(BookCategoryDTO dto);
        Task DeleteCategoryAsync(int categoryId);
    }
}
