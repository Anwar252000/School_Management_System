using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class DailyExpenseMapper : IMapper<DailyExpenseDTO, DailyExpense>
    {
        public DailyExpense MapToEntity(DailyExpenseDTO dto)
        {
            return new DailyExpense
            {
                DailyExpenseId = dto.DailyExpenseId,
                Item = dto.Item,
                ExpenseCategoryId = dto.ExpenseCategoryId,
                Description = dto.Description,
                Amount = dto.Amount,
                TotalAmount = dto.TotalAmount,
                Quantity = dto.Quantity,
                AmountDate = dto.AmountDate,
                AmountType = dto.AmountType,
                IsActive = dto.IsActive,
                CreatedAt = dto.CreatedAt,
                CreatedBy = dto.CreatedBy,
                UpdatedAt = dto.UpdatedAt,
                UpdatedBy = dto.UpdatedBy
            };
        }

        public DailyExpenseDTO MapToDto(DailyExpense entity)
        {
            return new DailyExpenseDTO
            {
                DailyExpenseId = entity.DailyExpenseId,
                Item = entity.Item,
                ExpenseCategoryId = entity.ExpenseCategoryId,
                CategoryName = entity.ExpenseCategory.CategoryName,
                Description = entity.Description,
                Amount = entity.Amount,
                Quantity = entity.Quantity,
                TotalAmount = entity.TotalAmount,
                AmountDate = entity.AmountDate,
                AmountType = entity.AmountType,
                IsActive = entity.IsActive,
                CreatedAt = entity.CreatedAt,
                CreatedBy = entity.CreatedBy,
                UpdatedAt = entity.UpdatedAt,
                UpdatedBy = entity.UpdatedBy
            };
        }

        public DailyExpenseDTO MapToDtoWithSubEntity(DailyExpense entity)
        {
            return new DailyExpenseDTO
            {
                DailyExpenseId = entity.DailyExpenseId,
                Item = entity.Item,
                ExpenseCategoryId = entity.ExpenseCategoryId,
                Description = entity.Description,
                Amount = entity.Amount,
                Quantity = entity.Quantity,
                TotalAmount = entity.TotalAmount,
                AmountDate = entity.AmountDate,
                AmountType = entity.AmountType,
                IsActive = entity.IsActive,
                CreatedAt = entity.CreatedAt,
                CreatedBy = entity.CreatedBy,
                UpdatedAt = entity.UpdatedAt,
                UpdatedBy = entity.UpdatedBy,
                CategoryName = entity.ExpenseCategory?.CategoryName,
            };
        }

        public List<DailyExpense> MapToEntities(DailyExpenseDTO dto)
        {
            throw new NotImplementedException();
        }

        public List<DailyExpense> MapToEntities(IEnumerable<DailyExpenseDTO> dto)
        {
            throw new NotImplementedException();
        }
    }
}
