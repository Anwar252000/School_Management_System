using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IReports
    {
        Task<List<GLDTO>> GetGeneralLedgerByIdAsync(int accountId);

        Task<List<GLDTO>> GetGeneralLedgerAsync();

        Task<List<TrialBalanceDTO>> GetTrialBalanceAsync();

        Task<List<IStatementDTO>> GetIncomeStatementAsync();
        Task<List<BalanceSheetDTO>> GetBalanceSheetAsync();
    }
}
