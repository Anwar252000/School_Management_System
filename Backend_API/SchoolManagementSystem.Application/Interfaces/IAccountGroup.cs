using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IAccountGroups
    {
        Task<List<AccountGroupDTO>> GetAllAccountGroupsAsync();
        Task<List<AccountGroupHierarchyDTO>> GetAccountHierarchyAsync();
        Task<AccountGroupDTO> GetAccountGroupByIdAsync(int accountGroupId);
        Task AddAccountGroupAsync(AccountGroupDTO accountGroup);
        Task UpdateAccountGroupAsync(AccountGroupDTO accountGroup);
        Task DeleteAccountGroupAsync(int accountGroupId);
    }
}
