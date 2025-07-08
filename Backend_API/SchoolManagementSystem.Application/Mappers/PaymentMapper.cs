using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class PaymentMapper : IMapper<PaymentDTO, Payment>
    {


        public Payment MapToEntity(PaymentDTO dto)
        {
            return new Payment
            {
                PaymentId = dto.PaymentId,
                AmountPaid = dto.AmountPaid,
                PaymentDate = dto.PaymentDate,
                PaymentMethod = dto.PaymentMethod,
                SponsorshipId = dto.SponsorshipId,

                //CreatedAt = dto.CreatedAt,
                CreatedBy = dto.CreatedBy,
                UpdatedAt = dto.UpdatedAt,
                IsActive = dto.IsActive,

            };
        }
        public PaymentDTO MapToDto(Payment entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            return new PaymentDTO
            {
                PaymentId = entity.PaymentId,
                AmountPaid = entity.AmountPaid,
                PaymentDate = entity.PaymentDate,
                PaymentMethod = entity.PaymentMethod,
                SponsorshipId = entity.SponsorshipId,
                SponsorshipAmount = entity.Sponsorship?.Amount,
                SponsorName = entity.Sponsorship.Sponsor.SponsorName,
                //FirstName = entity.Sponsorship.Student.FirstName,
                //LastName = entity.Sponsorship.Student.LastName,
                CreatedBy = entity.CreatedBy,
                UpdatedAt = entity.UpdatedAt,
                IsActive = entity.IsActive,



            };
        }

        public List<Payment> MapToEntities(PaymentDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<Payment> MapToEntities(IEnumerable<PaymentDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
