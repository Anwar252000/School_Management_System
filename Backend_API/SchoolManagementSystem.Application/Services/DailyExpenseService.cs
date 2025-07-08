using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class DailyExpenseService : IDailyExpense
    {
        private readonly IGenericRepository<DailyExpense> _dailyExpenseRepository;
        private readonly DailyExpenseMapper _mapper;

        public DailyExpenseService(IGenericRepository<DailyExpense> genericRepository, DailyExpenseMapper mapper)
        {
            _dailyExpenseRepository = genericRepository;
            _mapper = mapper;
        }


        public async Task AddDailyExpenseAsync(DailyExpenseDTO dailyExpense)
        {
            try
            {

                var model = _mapper.MapToEntity(dailyExpense);

                await _dailyExpenseRepository.AddAsync(model);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task DeleteDailyExpenseAsync(int expenseId)
        {
            var expense = await _dailyExpenseRepository.GetByIdAsync(expenseId);
            if (expense != null)
            {
                expense.IsActive = false;
                await _dailyExpenseRepository.UpdateAsync(expense);
            }
        }

        public async Task<List<DailyExpenseDTO>> GetAllDailyExpensesAsync()
        {
            try
            {
                var expenses = await _dailyExpenseRepository.GetAllAsync(
                    include: query =>
                    query.Include(e => e.ExpenseCategory)

                );

                var activeExpenses = expenses.Where(e => e.IsActive).ToList();

                var dtos = activeExpenses.Select(e => _mapper.MapToDto(e)).ToList();

                return dtos;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<DailyExpenseDTO> GetDailyExpenseByIdAsync(int expenseId)
        {
            var entity = await _dailyExpenseRepository.GetByIdAsync(expenseId);
            return _mapper.MapToDto(entity);
        }

        public async Task UpdateDailyExpenseAsync(DailyExpenseDTO dailyExpense)
        {
            var model = _mapper.MapToEntity(dailyExpense);
            await _dailyExpenseRepository.UpdateAsync(model);
        }
    }
}
