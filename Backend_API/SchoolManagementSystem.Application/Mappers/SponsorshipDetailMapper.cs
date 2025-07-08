using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class SponsorshipDetailMapper : IMapper<SponsorshipDetailDTO, SponsorshipDetail>
    {


        public SponsorshipDetail MapToEntity(SponsorshipDetailDTO dto)
        {
            return new SponsorshipDetail
            {

                Amount = dto.Amount,
                SponsorshipId = dto.SponsorshipId,
                StudentId = dto.StudentId,
                ClassId = dto.ClassId,
                CreatedAt = dto.CreatedAt,
                CreatedBy = dto.CreatedBy,
            };
        }
        public SponsorshipDetailDTO MapToDto(SponsorshipDetail entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            return new SponsorshipDetailDTO
            {
                //SponsorshipDetailId = entity.SponsorshipDetailId,
                Amount = entity.Amount,
                SponsorshipId = entity.SponsorshipId,
                ClassId = entity.ClassId,
                StudentId = entity.StudentId,
                SponsorName = entity?.Sponsorship?.Sponsor?.SponsorName,
                CreatedBy = entity.CreatedBy,

                StudentName = entity.Student.FirstName,
                //Gender = entity.Student.Gender,
                //PhoneNumber = entity.Sponsor.PhoneNumber,
                ClassName = entity.Class?.ClassName,


            };
        }

        public List<SponsorshipDetail> MapToEntities(SponsorshipDetailDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<SponsorshipDetail> MapToEntities(IEnumerable<SponsorshipDetailDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
