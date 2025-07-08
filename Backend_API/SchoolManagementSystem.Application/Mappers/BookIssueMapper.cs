using SchoolManagementSystem.Application.DTOs.Library;
using SchoolManagementSystem.Domain.Entities.Library;

namespace SchoolManagementSystem.Application.Mappers
{
    public class BookIssueMapper : IMapper<BookIssueDTO, BookIssue>
    {
        public BookIssue MapToEntity(BookIssueDTO dto)
        {
            return new BookIssue
            {
                BookIssueId = dto.BookIssueId,
                BookId = dto.BookId,
                IssuedTo = dto.IssuedTo,
                IssueDate = dto.IssueDate ?? DateTime.UtcNow,
                AdvancePayment = dto.AdvancePayment,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = dto.CreatedBy,
                IsActive = true
            };
        }

        public BookIssueDTO MapToDto(BookIssue entity)
        {
            return new BookIssueDTO
            {
                BookIssueId = entity.BookIssueId,
                BookId = entity.BookId,
                BookTitle = entity.Book?.Title,
                IssuedTo = entity.IssuedTo,
                IssueDate = entity.IssueDate,
                AdvancePayment = entity.AdvancePayment,
                CreatedAt = entity.CreatedAt,
                CreatedBy = entity.CreatedBy,
                IsActive = entity.IsActive
            };
        }

        public List<BookIssue> MapToEntities(BookIssueDTO dto) => throw new NotImplementedException();
        public List<BookIssue> MapToEntities(IEnumerable<BookIssueDTO> dto) => throw new NotImplementedException();
    }
}
