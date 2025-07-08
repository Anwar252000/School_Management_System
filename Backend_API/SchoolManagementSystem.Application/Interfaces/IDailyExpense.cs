using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IDailyExpense
    {
        Task<List<DailyExpenseDTO>> GetAllDailyExpensesAsync();
        Task<DailyExpenseDTO> GetDailyExpenseByIdAsync(int expenseId);
        Task AddDailyExpenseAsync(DailyExpenseDTO dailyExpense);
        Task UpdateDailyExpenseAsync(DailyExpenseDTO dailyExpense);
        Task DeleteDailyExpenseAsync(int expenseId);
    }
}
