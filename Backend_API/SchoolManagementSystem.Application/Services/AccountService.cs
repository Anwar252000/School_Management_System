using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class AccountService : IAccount
    {
        private readonly IGenericRepository<Account> _accountRepository;
        private readonly AccountMapper _mapper;

        public AccountService(IGenericRepository<Account> genericRepository, AccountMapper accountMapper)
        {
            _accountRepository = genericRepository;
            _mapper = accountMapper;
        }

        public async Task AddAccountAsync(AccountDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _accountRepository.AddAsync(model);
        }

        public async Task DeleteAccountAsync(int accountId)
        {
            var account = await _accountRepository.GetByIdAsync(accountId);
            if (account != null)
            {
                account.IsActive = false;
                await _accountRepository.UpdateAsync(account);
            }
        }

        public async Task<List<AccountDTO>> GetAllAccountsAsync()
        {
            var account = await _accountRepository.GetAllAsync(
                include: query => query.Include(a => a.ParentAccount)  
                );
            var activeAccount = account.Where(x => x.IsActive).ToList();
            var lst = activeAccount.Select(_mapper.MapToDto).ToList();
            return lst;
        }

        public async Task<AccountDTO> GetAccountByIdAsync(int accountId)
        {
            var response = await _accountRepository.GetByIdAsync(accountId);
            return _mapper.MapToDto(response);
        }

        public async Task UpdateAccountAsync(AccountDTO dto)
        {
            var existingEntity = await _accountRepository.GetByIdAsync(dto.AccountId);

            if (existingEntity == null)
            {
                throw new KeyNotFoundException("Account not found.");
            }

            var result = _mapper.MapToEntity(dto);
            result.UpdatedAt = DateTime.UtcNow;
            result.CreatedAt = existingEntity.CreatedAt;
            await _accountRepository.UpdateAsync(result, true);
        }

    }
}
