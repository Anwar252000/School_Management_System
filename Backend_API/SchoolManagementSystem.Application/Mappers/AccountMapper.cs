using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class AccountMapper : IMapper<AccountDTO, Account>
    {
        public AccountDTO MapToDto(Account entity)
        {
            return new AccountDTO
            {
                AccountId = entity.AccountId,
                ParentAccountId = entity.ParentAccountId,
                ParentAccountName = entity.ParentAccount?.ParentAccountName,
                AccountCode = entity.AccountCode,
                AccountName = entity.AccountName,
                IsSubAccount = entity.IsSubAccount,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }

        public List<Account> MapToEntities(AccountDTO dto)
        {
            throw new NotImplementedException();
        }

        public List<Account> MapToEntities(IEnumerable<AccountDTO> dto)
        {
            throw new NotImplementedException();
        }

        public Account MapToEntity(AccountDTO dto)
        {
            return new Account
            {
                AccountId = dto.AccountId,
                ParentAccountId = dto.ParentAccountId,
                AccountCode = dto.AccountCode,
                AccountName = dto.AccountName,
                IsSubAccount= dto.IsSubAccount,
                CreatedAt = dto.CreatedAt,
                UpdatedAt = dto.UpdatedAt
            };
        }


    }
}
