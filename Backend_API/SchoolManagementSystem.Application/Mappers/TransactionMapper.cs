using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class TransactionMapper : IMapper<TransactionDTO, Transaction>
    {
        public TransactionDTO MapToDto(Transaction entity)
        {
            return new TransactionDTO
            {
                TransactionId = entity.TransactionId,
                EntryDate = entity.EntryDate,
                CreatedBy = entity.CreatedBy,
                IsActive = entity.IsActive,
                Messer = entity.Messer,
                Payee = entity.Payee,
                Status = entity.Status,
                UpdatedBy = entity.UpdatedBy,
                VoucherNo = entity.VoucherNo,
                VoucherTypeId = entity.VoucherTypeId,
                VoucherType = entity?.VoucherTypes?.Name,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt,
                TransactionDetail = entity?.TransactionDetail?.Select(t => new TransactionDetailDTO
                {
                    TransactionDetailId = t.TransactionDetailId,
                    TransactionId = t.TransactionId,
                    AccountId = t.AccountId,
                    CreditAmount = t.CreditAmount,
                    DebitAmount = t.DebitAmount,
                    Description = t.Description,
                    IsActive = t.IsActive,
                    CreatedBy = t.CreatedBy,
                    CreatedAt = t.CreatedAt,
                }).ToList(),
            };
        }

        public List<Transaction> MapToEntities(TransactionDTO dto)
        {
            throw new NotImplementedException();
        }

        public List<Transaction> MapToEntities(IEnumerable<TransactionDTO> dto)
        {
            throw new NotImplementedException();
        }

        public Transaction MapToEntity(TransactionDTO dto)
        {
            return new Transaction
            {
                TransactionId = dto.TransactionId,
                VoucherTypeId = dto.VoucherTypeId,
                VoucherNo = dto.VoucherNo,
                EntryDate = dto.EntryDate,
                Messer = dto.Messer,
                Payee = dto.Payee,
                Status = dto.Status,
                IsActive = true,
                CreatedBy = dto.CreatedBy,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = dto.UpdatedAt
            };
        }


    }
}
