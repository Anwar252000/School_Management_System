
using SchoolManagementSystem.Application.DTOs.Fee;
using SchoolManagementSystem.Domain.Entities.Fee;

namespace SchoolManagementSystem.Application.Mappers
{
    public class FeeViewMapper : IMapper<FeeViewDTO, FeeView>
    {
        public FeeView MapToEntity(FeeViewDTO dto)
        {
            return new FeeView
            {
                StudentId = dto.StudentId,
                GrNo = dto.GrNo,
                FullName = dto.FullName,
                CampusName = dto.CampusName,
                VoucherId = dto.VoucherId,
                FeeMonth = dto.FeeMonth,
                FeeYear = dto.FeeYear,
                TotalFees = dto.TotalFees,
                PaidAmount = dto.PaidAmount,
                PendingAmount = dto.PendingAmount,
                DueDate = dto.DueDate,
                PaymentStatus = dto.PaymentStatus,
                DiscountAmount = dto.DiscountAmount,
                SponsorName = dto.SponsorName
            };
        }

        public FeeViewDTO MapToDto(FeeView entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            return new FeeViewDTO
            {
                StudentId = entity.StudentId,
                GrNo = entity.GrNo,
                FullName = entity.FullName,
                CampusName = entity.CampusName,
                VoucherId = entity.VoucherId,
                FeeMonth = entity.FeeMonth,
                FeeYear = entity.FeeYear,
                TotalFees = entity.TotalFees,
                PaidAmount = entity.PaidAmount,
                PendingAmount = entity.PendingAmount,
                DueDate = entity.DueDate,
                PaymentStatus = entity.PaymentStatus,
                DiscountAmount = entity.DiscountAmount,
                SponsorName = entity.SponsorName
            };
        }

        public List<FeeView> MapToEntities(FeeViewDTO dto)
        {
            throw new NotImplementedException();
        }

        public List<FeeView> MapToEntities(IEnumerable<FeeViewDTO> dto)
        {
            throw new NotImplementedException();
        }
    }
}
