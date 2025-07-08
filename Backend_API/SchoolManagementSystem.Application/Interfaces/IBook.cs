using SchoolManagementSystem.Application.DTOs.Library;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IBook
    {
        Task<List<BookDTO>> GetAllBookAsync();
        Task AddBookAsync(BookDTO dto);
        Task UpdateBookAsync(BookDTO dto);
        Task DeleteBookAsync(int bookId);
    }
}
