using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class SponsorshipMapper : IMapper<SponsorshipDTO, Sponsorship>
    {


        public Sponsorship MapToEntity(SponsorshipDTO dto)
        {
            return new Sponsorship
            {

                Amount = dto.Amount,
                Frequency = dto.Frequency,
                StartDate = dto.StartDate,
                SponsorId = dto.SponsorId,
                CreatedAt = dto.CreatedAt,
                CreatedBy = dto.CreatedBy,
            };
        }
        public SponsorshipDTO MapToDto(Sponsorship entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            return new SponsorshipDTO
            {
                SponsorshipId = entity.SponsorshipId,
                Amount = entity.Amount,
                Frequency = entity.Frequency,
                StartDate = entity.StartDate,
                SponsorId = entity.SponsorId,
                CreatedBy = entity.CreatedBy,
                SponsorName = entity?.Sponsor.SponsorName,
                Details = entity?.SponsorshipDetails?.Select(x => new SponsorshipDetailDTO
                {
                    Amount = x.Amount,
                    SponsorshipId = x.SponsorshipId,
                    ClassId = x.ClassId,
                    StudentId = x.StudentId,
                    CreatedBy = x.CreatedBy,
                    StudentName = x.Student.FirstName,
                    ClassName = x.Class.ClassName,
                }).ToList()

            };
        }

        public List<Sponsorship> MapToEntities(SponsorshipDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<Sponsorship> MapToEntities(IEnumerable<SponsorshipDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
