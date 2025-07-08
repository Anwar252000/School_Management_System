using SchoolManagementSystem.Application.DTOs.Library;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IBookPurchase
    {
        Task<List<BookPurchaseDTO>> GetAllPurchaseAsync();
        Task AddPurchaseAsync(BookPurchaseDTO dto);
        Task UpdatePurchaseAsync(BookPurchaseDTO dto);
        Task DeletePurchaseAsync(int purchaseId);
    }
}
