using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class AccountGroupMapper : IMapper<AccountGroupDTO, AccountGroup>
    {
        public AccountGroupDTO MapToDto(AccountGroup entity)
        {
            return new AccountGroupDTO
            {
                AccountGroupId = entity.AccountGroupId,
                AccountGroupCode = entity.AccountGroupCode,
                AccountGroupName = entity.AccountGroupName,
                NormalBalance = entity.NormalBalance,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }

        public List<AccountGroup> MapToEntities(AccountGroupDTO dto)
        {
            throw new NotImplementedException();
        }

        public List<AccountGroup> MapToEntities(IEnumerable<AccountGroupDTO> dto)
        {
            throw new NotImplementedException();
        }

        public AccountGroup MapToEntity(AccountGroupDTO dto)
        {
            return new AccountGroup
            {
                AccountGroupId = dto.AccountGroupId,
                AccountGroupCode = dto.AccountGroupCode,
                AccountGroupName = dto.AccountGroupName,
                NormalBalance = dto.NormalBalance,
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
                UpdatedAt = dto.UpdatedAt
            };
        }

        public AccountGroupDTO MapToDtoWithSubEntity(AccountGroup entity)
        {
            return new AccountGroupDTO
            {
                AccountGroupId = entity.AccountGroupId,
                AccountGroupCode= entity.AccountGroupCode,
                AccountGroupName = entity.AccountGroupName,
                NormalBalance = entity.NormalBalance,
                CreatedAt = entity.CreatedAt,
                IsActive = entity.IsActive,
                UpdatedAt = entity.UpdatedAt,

                // Map related entities
                ParentAccounts = entity.ParentAccounts.Select(x => new ParentAccountDTO
                {
                    ParentAccountId = x.ParentAccountId,
                    ParentAccountCode = x.ParentAccountCode,
                    ParentAccountName = x.ParentAccountName,
                    CreatedAt = x.CreatedAt,
                }).ToList(),
            };
        }

    }
}
