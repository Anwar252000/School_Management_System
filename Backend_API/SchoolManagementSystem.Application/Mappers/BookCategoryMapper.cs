using SchoolManagementSystem.Application.DTOs.Library;
using SchoolManagementSystem.Domain.Entities.Library;

namespace SchoolManagementSystem.Application.Mappers
{
    public class BookCategoryMapper : IMapper<BookCategoryDTO, BookCategory>
    {
        public BookCategory MapToEntity(BookCategoryDTO dto)
        {
            return new BookCategory
            {
                BookCategoryId = dto.BookCategoryId,
                CategoryName = dto.CategoryName,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = dto.CreatedBy,
                IsActive = true
            };
        }

        public BookCategoryDTO MapToDto(BookCategory entity)
        {
            return new BookCategoryDTO
            {
                BookCategoryId = entity.BookCategoryId,
                CategoryName = entity.CategoryName,
                CreatedAt = entity.CreatedAt,
                CreatedBy = entity.CreatedBy,
                IsActive = entity.IsActive
            };
        }

        public List<BookCategory> MapToEntities(BookCategoryDTO dto) => throw new NotImplementedException();
        public List<BookCategory> MapToEntities(IEnumerable<BookCategoryDTO> dto) => throw new NotImplementedException();
    }
}
