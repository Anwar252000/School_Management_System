using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class ExpenseCategoryService : IExpenseCategory
    {
        private readonly IGenericRepository<ExpenseCategory> _expenseCategoryRepository;
        private readonly ExpenseCategoryMapper _mapper;

        public ExpenseCategoryService(IGenericRepository<ExpenseCategory> genericRepository, ExpenseCategoryMapper mapper)
        {
            _expenseCategoryRepository = genericRepository;
            _mapper = mapper;
        }

        public async Task AddExpenseCategoryAsync(ExpenseCategoryDTO dto)
        {
            try
            {
                var entity = _mapper.MapToEntity(dto);
                await _expenseCategoryRepository.AddAsync(entity);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task DeleteExpenseCategoryAsync(int expenseCategoryId)
        {
            var category = await _expenseCategoryRepository.GetByIdAsync(expenseCategoryId);
            if (category != null)
            {
                category.IsActive = false;
                await _expenseCategoryRepository.UpdateAsync(category);
            }
        }

        public async Task<List<ExpenseCategoryDTO>> GetAllExpenseCategoriesAsync()
        {
            try
            {
                var categories = await _expenseCategoryRepository.GetAllAsync();

                var activeCategories = categories.Where(c => c.IsActive == true).ToList();

                var dtos = activeCategories.Select(c => _mapper.MapToDto(c)).ToList();

                return dtos;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<ExpenseCategoryDTO?> GetExpenseCategoryByIdAsync(int expenseCategoryId)
        {
            var entity = await _expenseCategoryRepository.GetByIdAsync(expenseCategoryId);
            return entity != null ? _mapper.MapToDto(entity) : null;
        }

        public async Task UpdateExpenseCategoryAsync(ExpenseCategoryDTO dto)
        {
            var existing = await _expenseCategoryRepository.GetByIdAsync(dto.ExpenseCategoryId);

            if (existing == null)
                throw new Exception("Expense category not found.");

            var updated = _mapper.MapDtoToEntity(dto, existing);

            await _expenseCategoryRepository.UpdateAsync(updated);
        }
    }
}
