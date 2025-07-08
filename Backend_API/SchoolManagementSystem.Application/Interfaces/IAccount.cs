using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IAccount
    {
        Task<List<AccountDTO>> GetAllAccountsAsync();
        Task<AccountDTO> GetAccountByIdAsync(int accountId);
        Task AddAccountAsync(AccountDTO account);
        Task UpdateAccountAsync(AccountDTO account);
        Task DeleteAccountAsync(int accountId);
    }
}
