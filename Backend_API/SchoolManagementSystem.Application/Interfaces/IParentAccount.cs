using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IParentAccount
    {
        Task<List<ParentAccountDTO>> GetAllParentAccountsAsync();
        Task AddParentAccountAsync(ParentAccountDTO dto);
        Task UpdateParentAccountAsync(ParentAccountDTO dto);
        Task DeleteParentAccountAsync(int parentAccountId);
    }
}
