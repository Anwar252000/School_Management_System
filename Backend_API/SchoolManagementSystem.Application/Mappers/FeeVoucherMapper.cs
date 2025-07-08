using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Entities.Fee;

namespace SchoolManagementSystem.Application.Mappers
{
    public class FeeVoucherMapper : IMapper<FeeVoucherDTO, FeeVoucher>
    {
        public FeeVoucherDTO MapToDto(FeeVoucher entity)
        {
            return new FeeVoucherDTO
            {
                VoucherId = entity.VoucherId,
                StudentId = entity.StudentId,
                CampusId = entity.CampusId,
                FeeMonth = entity.FeeMonth,
                FeeYear = entity.FeeYear,
                TotalAmount = (int)entity.TotalAmount,
                DueDate = entity.DueDate,
                Paid = entity.Paid,
                PaymentDate = entity.PaymentDate,
                LateFee = (int)entity.LateFee,
                //IsActive = entity.IsActive,
                CreatedBy = entity.CreatedBy,
            };
        }

        public List<FeeVoucher> MapToEntities(IEnumerable<FeeVoucherDTO> dto)
        {
            throw new NotImplementedException();
        }

        public List<FeeVoucher> MapToEntities(FeeVoucherDTO dto)
        {
            throw new NotImplementedException();
        }

        public FeeVoucher MapToEntity(FeeVoucherDTO dto)
        {
            return new FeeVoucher
            {
                VoucherId = dto.VoucherId,
                StudentId = dto.StudentId,
                CampusId = dto.CampusId,
                FeeMonth = dto.FeeMonth,
                FeeYear = dto.FeeYear,
                TotalAmount = dto.TotalAmount,
                DueDate = dto.DueDate,
                Paid = dto.Paid,
                PaymentDate = dto.PaymentDate,
                LateFee = dto.LateFee,
                //IsActive = dto.IsActive,
                //CreatedBy = dto.CreatedBy,
            };
        }
    }
}
