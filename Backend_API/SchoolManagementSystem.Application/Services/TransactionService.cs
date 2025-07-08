using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class TransactionService : ITransaction
    {
        private readonly IGenericRepository<Transaction> _transactionRepository;
        private readonly IGenericRepository<TransactionDetail> _transactionsDetailRepository;
        private readonly TransactionMapper _mapper;

        public TransactionService(
            IGenericRepository<Transaction> genericRepository,
            IGenericRepository<TransactionDetail> transactionsDetailRepository,
            TransactionMapper transactionMapper
            )
        {
            _transactionRepository = genericRepository;
            _transactionsDetailRepository = transactionsDetailRepository;
            _mapper = transactionMapper;
        }

        public async Task AddTransactionAsync(TransactionDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _transactionRepository.AddAsync(model);

            var transactionId = model.TransactionId;
            if (dto.TransactionDetail != null && dto.TransactionDetail.Any())
            {
                foreach (var detailDto in dto.TransactionDetail)
                {
                    var detailEntity = new TransactionDetail
                    {
                        TransactionId = transactionId,
                        CreditAmount = detailDto.CreditAmount,
                        DebitAmount = detailDto.DebitAmount,
                        AccountId = detailDto.AccountId,
                        Description = detailDto.Description,
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = dto.CreatedBy,
                        IsActive = true,
                    };
                    detailEntity.TransactionId = transactionId; // Set foreign key
                    await _transactionsDetailRepository.AddAsync(detailEntity);
                }
            }
        }

        public async Task DeleteTransactionAsync(int transactionId)
        {
            var transaction = await _transactionRepository.GetByIdAsync(transactionId);
            if (transaction != null)
            {
                transaction.IsActive = false;
                await _transactionRepository.UpdateAsync(transaction);
            }
        }

        public async Task<List<TransactionDTO>> GetAllTransactionsAsync()
        {
            var transaction = await _transactionRepository.GetAllAsync(
                include: query => query.Include(x => x.TransactionDetail)
                .Include(x => x.VoucherTypes)
                );
            var activeTransaction = transaction.Where(x => x.IsActive).ToList();
            var lst = activeTransaction.Select(_mapper.MapToDto).ToList();
            return lst;
        }

        public async Task<TransactionDTO> GetTransactionByIdAsync(int transactionId)
        {
            var response = await _transactionRepository.GetByIdAsync(transactionId);
            return _mapper.MapToDto(response);
        }

        public async Task UpdateTransactionAsync(TransactionDTO dto)
        {
            var existingEntity = await _transactionRepository.GetByIdAsync(dto.TransactionId);

            if (existingEntity == null)
            {
                throw new KeyNotFoundException("Transaction not found.");
            }

            var result = _mapper.MapToEntity(dto);
            result.UpdatedAt = DateTime.UtcNow;
            result.CreatedAt = existingEntity.CreatedAt;
            await _transactionRepository.UpdateAsync(result, true);

            var existingDetails = await _transactionsDetailRepository
            .GetAllAsync(d => d.TransactionId == dto.TransactionId);

            foreach (var detail in existingDetails)
            {
                await _transactionsDetailRepository.DeleteAsync(detail);
            }

            foreach (var detailDto in dto.TransactionDetail)
            {
                var newDetail = new TransactionDetail
                {
                    TransactionId = dto.TransactionId,
                    AccountId = detailDto.AccountId,
                    Description = detailDto.Description,
                    DebitAmount = detailDto.DebitAmount,
                    CreditAmount = detailDto.CreditAmount,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = dto.CreatedBy,
                    IsActive = true
                };

                await _transactionsDetailRepository.AddAsync(newDetail);
            }

        }

    }
}
