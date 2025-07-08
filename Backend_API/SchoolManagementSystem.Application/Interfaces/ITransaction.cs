using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface ITransaction
    {
        Task<List<TransactionDTO>> GetAllTransactionsAsync();
        Task<TransactionDTO> GetTransactionByIdAsync(int transactionId);
        Task AddTransactionAsync(TransactionDTO transaction);
        Task UpdateTransactionAsync(TransactionDTO transaction);
        Task DeleteTransactionAsync(int transactionId);
    }
}
