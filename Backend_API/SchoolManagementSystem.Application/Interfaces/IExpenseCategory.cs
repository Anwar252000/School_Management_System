using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IExpenseCategory
    {
        Task<List<ExpenseCategoryDTO>> GetAllExpenseCategoriesAsync();
        Task<ExpenseCategoryDTO?> GetExpenseCategoryByIdAsync(int expenseCategoryId);
        Task AddExpenseCategoryAsync(ExpenseCategoryDTO dto);
        Task UpdateExpenseCategoryAsync(ExpenseCategoryDTO dto);
        Task DeleteExpenseCategoryAsync(int expenseCategoryId);
    }
}
