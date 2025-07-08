using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;
using SchoolManagementSystem.Infrastructure.Data;

namespace SchoolManagementSystem.Application.Services
{
    public class ReportsService : IReports
    {
        private readonly SchoolContext _dbContext;
        public ReportsService(SchoolContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<GLDTO>> GetGeneralLedgerByIdAsync(int accountId)
        {
            var accountIdParam = new SqlParameter("@AccountId", accountId);
            var fromDateParam = new SqlParameter("@FromDate", DBNull.Value); // optional
            var toDateParam = new SqlParameter("@ToDate", DBNull.Value);     // optional

            var result = await _dbContext.Database
                .SqlQueryRaw<GLDTO>(
                    "EXEC GetGeneralLedgerById @AccountId, @FromDate, @ToDate",
                    accountIdParam, fromDateParam, toDateParam
                )
                .ToListAsync();

            return result;
        }

        public async Task<List<GLDTO>> GetGeneralLedgerAsync()
        {
            var fromDateParam = new SqlParameter("@FromDate", DBNull.Value); // optional
            var toDateParam = new SqlParameter("@ToDate", DBNull.Value);     // optional

            var result = await _dbContext.Database
                .SqlQueryRaw<GLDTO>(
                    "EXEC GetGeneralLedger @FromDate, @ToDate",
                    fromDateParam, toDateParam
                )
                .ToListAsync();

            return result;
        }

        public async Task<List<TrialBalanceDTO>> GetTrialBalanceAsync()
        {
            var fromDateParam = new SqlParameter("@FromDate", DBNull.Value); // optional
            var toDateParam = new SqlParameter("@ToDate", DBNull.Value);     // optional

            var result = await _dbContext.Database
                .SqlQueryRaw<TrialBalanceDTO>(
                    "EXEC GetTrialBalance @FromDate, @ToDate",
                    fromDateParam, toDateParam
                )
                .ToListAsync();

            return result;
        }

        public async Task<List<IStatementDTO>> GetIncomeStatementAsync()
        {

            var result = await _dbContext.Database
             .SqlQueryRaw<IStatementDTO>("EXEC GetIncomeStatement")
             .ToListAsync();
            return result;
        }

        public async Task<List<BalanceSheetDTO>> GetBalanceSheetAsync()
        {
            var result = await _dbContext.Database
                .SqlQueryRaw<BalanceSheetDTO>(
                    "EXEC GetBalanceSheetReport"
                )
                .ToListAsync();

            return result;
        }
    }
}
