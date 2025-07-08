using SchoolManagementSystem.Application.DTOs.Library;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IBookIssue
    {
        Task<List<BookIssueDTO>> GetAllIssueAsync();
        Task AddIssueAsync(BookIssueDTO dto);
        Task UpdateIssueAsync(BookIssueDTO dto);
        Task DeleteIssueAsync(int issueId);
    }
}
