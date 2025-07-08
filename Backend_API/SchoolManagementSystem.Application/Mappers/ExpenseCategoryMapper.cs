using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class ExpenseCategoryMapper : IMapper<ExpenseCategoryDTO, ExpenseCategory>
    {
        public ExpenseCategory MapToEntity(ExpenseCategoryDTO dto)
        {
            return new ExpenseCategory
            {
                ExpenseCategoryId = dto.ExpenseCategoryId,
                CategoryName = dto.CategoryName,
                IsActive = dto.IsActive,
                CreatedAt = dto.CreatedAt,
                CreatedBy = dto.CreatedBy,
                UpdatedAt = dto.UpdatedAt,
                UpdatedBy = dto.UpdatedBy
            };
        }

        public ExpenseCategoryDTO MapToDto(ExpenseCategory entity)
        {
            return new ExpenseCategoryDTO
            {
                ExpenseCategoryId = entity.ExpenseCategoryId,
                CategoryName = entity.CategoryName,
                IsActive = entity.IsActive,
                CreatedAt = entity.CreatedAt,
                CreatedBy = entity.CreatedBy,
                UpdatedAt = entity.UpdatedAt,
                UpdatedBy = entity.UpdatedBy
            };
        }

        public ExpenseCategoryDTO MapToDtoWithSubEntity(ExpenseCategory entity)
        {
            // No sub-entities in ExpenseCategory, return basic DTO
            return MapToDto(entity);
        }

        public List<ExpenseCategory> MapToEntities(ExpenseCategoryDTO dto)
        {
            throw new NotImplementedException();
        }

        public List<ExpenseCategory> MapToEntities(IEnumerable<ExpenseCategoryDTO> dto)
        {
            throw new NotImplementedException();
        }

        internal ExpenseCategory MapDtoToEntity(ExpenseCategoryDTO dto, ExpenseCategory existing)
        {
            // Update the existing entity with new values from the DTO
            existing.CategoryName = dto.CategoryName;
            existing.IsActive = dto.IsActive;
            existing.UpdatedAt = dto.UpdatedAt;
            existing.UpdatedBy = dto.UpdatedBy;
            return existing;
        }
    }
}
