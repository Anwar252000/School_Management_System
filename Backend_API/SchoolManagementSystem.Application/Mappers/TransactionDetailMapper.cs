using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class TransactionDetailMapper : IMapper<TransactionDetailDTO, TransactionDetail>
    {
        public TransactionDetailDTO MapToDto(TransactionDetail entity)
        {
            return new TransactionDetailDTO
            {
                TransactionDetailId = entity.TransactionDetailId,
                AccountId = entity.AccountId,
                TransactionId = entity.TransactionId,
                CreditAmount = entity.CreditAmount,
                DebitAmount = entity.DebitAmount,
                Description = entity.Description,
                CreatedBy = entity.CreatedBy,
                IsActive = entity.IsActive,
                UpdatedBy = entity.UpdatedBy,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }

        public List<TransactionDetail> MapToEntities(TransactionDetailDTO dto)
        {
            throw new NotImplementedException();
        }

        public List<TransactionDetail> MapToEntities(IEnumerable<TransactionDetailDTO> dto)
        {
            throw new NotImplementedException();
        }

        public TransactionDetail MapToEntity(TransactionDetailDTO dto)
        {
            return new TransactionDetail
            {
                TransactionDetailId = dto.TransactionDetailId,
                Description = dto.Description,
                AccountId = dto.AccountId,
                CreditAmount = dto.CreditAmount,
                DebitAmount = dto.DebitAmount,
                TransactionId = dto.TransactionId,
                IsActive = true,
                CreatedBy = dto.CreatedBy,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = dto.UpdatedAt,
                UpdatedBy = dto.UpdatedBy,
            };
        }


    }
}
