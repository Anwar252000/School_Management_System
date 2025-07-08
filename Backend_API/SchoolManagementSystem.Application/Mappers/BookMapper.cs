using SchoolManagementSystem.Application.DTOs.Library;
using SchoolManagementSystem.Domain.Entities.Library;

namespace SchoolManagementSystem.Application.Mappers
{
    public class BookMapper : IMapper<BookDTO, Book>
    {
        public Book MapToEntity(BookDTO dto)
        {
            return new Book
            {
                BookId = dto.BookId,
                Title = dto.Title,
                Author = dto.Author,
                Publisher = dto.Publisher,
                PublishedDate = dto.PublishedDate,
                BookCategoryId = dto.BookCategoryId,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = dto.CreatedBy,
                IsActive = true
            };
        }

        public BookDTO MapToDto(Book entity)
        {
            return new BookDTO
            {
                BookId = entity.BookId,
                Title = entity.Title,
                Author = entity.Author,
                Publisher = entity.Publisher,
                PublishedDate = entity.PublishedDate,
                BookCategoryId = entity.BookCategoryId,
                CategoryName = entity.BookCategory?.CategoryName,
                CreatedAt = entity.CreatedAt,
                CreatedBy = entity.CreatedBy,
                IsActive = entity.IsActive
            };
        }

        public List<Book> MapToEntities(BookDTO dto) => throw new NotImplementedException();
        public List<Book> MapToEntities(IEnumerable<BookDTO> dto) => throw new NotImplementedException();
    }
}
