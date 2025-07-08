using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class ParentAccountService : IParentAccount
    {
        private readonly IGenericRepository<ParentAccount> _parentAccountRepository;
        private readonly ParentAccountMapper _mapper;


        public ParentAccountService(IGenericRepository<ParentAccount> genericRepository, ParentAccountMapper parentAccountMapper)
        {
            _parentAccountRepository = genericRepository;
            _mapper = parentAccountMapper;

        }

        public async Task AddParentAccountAsync(ParentAccountDTO dto)
        {
            try
            {
                var model = _mapper.MapToEntity(dto);
                await _parentAccountRepository.AddAsync(model);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteParentAccountAsync(int parentAccountId)
        {
            var parentAccounts = await _parentAccountRepository.GetByIdAsync(parentAccountId);
            if (parentAccounts != null)
            {
                parentAccounts.IsActive = false;
                await _parentAccountRepository.UpdateAsync(parentAccounts);
            }
        }

        public async Task<List<ParentAccountDTO>> GetAllParentAccountsAsync()
        {
            var parentAccounts = await _parentAccountRepository.GetAllAsync(
                include: query => query.Include(a=>a.AccountGroup)
                );
            var activeParentAccounts = parentAccounts.Where(c => c.IsActive);

            var parentAccountDtos = activeParentAccounts.Select(c => _mapper.MapToDto(c)).ToList();
            return parentAccountDtos;
        }

        public async Task UpdateParentAccountAsync(ParentAccountDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _parentAccountRepository.UpdateAsync(model);
        }
    }
}
