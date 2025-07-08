using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class AccountGroupService : IAccountGroups
    {
        private readonly IGenericRepository<AccountGroup> _accountGroupRepository;
        private readonly AccountGroupMapper _mapper;

        public AccountGroupService(IGenericRepository<AccountGroup> genericRepository, AccountGroupMapper accountGroupMapper)
        {
            _accountGroupRepository = genericRepository;
            _mapper = accountGroupMapper;
        }

        public async Task AddAccountGroupAsync(AccountGroupDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _accountGroupRepository.AddAsync(model);
        }

        public async Task DeleteAccountGroupAsync(int accountGroupId)
        {
            var accountGroup = await _accountGroupRepository.GetByIdAsync(accountGroupId);
            if (accountGroup != null)
            {
                accountGroup.IsActive = false;
                await _accountGroupRepository.UpdateAsync(accountGroup);
            }
        }

        public async Task<List<AccountGroupDTO>> GetAllAccountGroupsAsync()
        {
            var accountGroup = await _accountGroupRepository.GetAllAsync();
            var activeAccountGroup = accountGroup.Where(x => x.IsActive).ToList();

            var lst = activeAccountGroup.Select(_mapper.MapToDto).ToList();


            return lst;
        }

        public async Task<AccountGroupDTO> GetAccountGroupByIdAsync(int accountGroupId)
        {
            var response = await _accountGroupRepository.GetByIdAsync(accountGroupId);
            return _mapper.MapToDto(response);
        }

        public async Task UpdateAccountGroupAsync(AccountGroupDTO dto)
        {
            var existingEntity = await _accountGroupRepository.GetByIdAsync(dto.AccountGroupId);

            if (existingEntity == null)
            {
                throw new KeyNotFoundException("Account Group not found.");
            }

            var result = _mapper.MapToEntity(dto);
            result.UpdatedAt = DateTime.UtcNow;
            result.CreatedAt = existingEntity.CreatedAt;
            await _accountGroupRepository.UpdateAsync(result, true);
        }

        public async Task<List<AccountGroupHierarchyDTO>> GetAccountHierarchyAsync()
        {
            try
            {
                var result = await _accountGroupRepository.GetAllAsync(
                    include: query => query.Include(x=>x.ParentAccounts)
                    .ThenInclude(x => x.ControllingAccounts));

                var mapped = result.Select(ag => new AccountGroupHierarchyDTO
                {
                    AccountGroupId = ag.AccountGroupId,
                    AccountGroupName = ag.AccountGroupName,
                    AccountGroupCode = ag.AccountGroupCode,
                    ParentAccount = ag.ParentAccounts?.Select(pa => new ParentAccountDTO
                    {
                        ParentAccountId = pa.ParentAccountId ?? 0,
                        ParentAccountCode = pa.ParentAccountCode,
                        AccountGroupId = pa.AccountGroupId ?? 0,
                        ParentAccountName = pa.ParentAccountName,
                        ControllingAccount = pa.ControllingAccounts?.Select(ca => new AccountDTO
                        {
                            AccountId = ca.AccountId,
                            AccountCode = ca.AccountCode,
                            AccountName = ca.AccountName
                        }).ToList()
                    }).ToList()
                }).ToList();

                return mapped;
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
