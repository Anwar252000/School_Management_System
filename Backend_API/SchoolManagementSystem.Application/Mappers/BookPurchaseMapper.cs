using SchoolManagementSystem.Application.DTOs.Library;
using SchoolManagementSystem.Domain.Entities.Library;

namespace SchoolManagementSystem.Application.Mappers
{
    public class BookPurchaseMapper : IMapper<BookPurchaseDTO, BookPurchase>
    {
        public BookPurchase MapToEntity(BookPurchaseDTO dto)
        {
            return new BookPurchase
            {
                BookPurchaseId = dto.BookPurchaseId,
                BookId = dto.BookId,
                PurchasedBy = dto.PurchasedBy,
                Quantity = dto.Quantity,
                Price = dto.Price,
                PurchaseDate = dto.PurchaseDate ?? DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = dto.CreatedBy,
                IsActive = true
            };
        }

        public BookPurchaseDTO MapToDto(BookPurchase entity)
        {
            return new BookPurchaseDTO
            {
                BookPurchaseId = entity.BookPurchaseId,
                BookId = entity.BookId,
                BookTitle = entity.Book?.Title,
                PurchasedBy = entity.PurchasedBy,
                Quantity = entity.Quantity,
                Price = entity.Price,
                PurchaseDate = entity.PurchaseDate,
                CreatedAt = entity.CreatedAt,
                CreatedBy = entity.CreatedBy,
                IsActive = entity.IsActive
            };
        }

        public List<BookPurchase> MapToEntities(BookPurchaseDTO dto) => throw new NotImplementedException();
        public List<BookPurchase> MapToEntities(IEnumerable<BookPurchaseDTO> dto) => throw new NotImplementedException();
    }
}
