using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class SponsorMapper : IMapper<SponsorDTO, Sponsor>
    {


        public Sponsor MapToEntity(SponsorDTO dto)
        {
            return new Sponsor
            {
                SponsorId = dto.SponsorId,
                SponsorName = dto.SponsorName,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                Gender = dto.Gender,
                Occupation = dto.Occupation,
                Country = dto.Country,
                State = dto.State,
                City = dto.City,
                PostalCode = dto.PostalCode,
                Address = dto.Address,
                CreatedAt = dto.CreatedAt,
                CreatedBy = dto.CreatedBy,
            };
        }
        public SponsorDTO MapToDto(Sponsor entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            return new SponsorDTO
            {
                SponsorId = entity.SponsorId,
                SponsorName = entity.SponsorName,
                PhoneNumber = entity.PhoneNumber,
                Email = entity.Email,
                Gender = entity.Gender,
                Occupation = entity.Occupation,
                Country = entity.Country,
                State = entity.State,
                City = entity.City,
                PostalCode = entity.PostalCode,
                Address = entity.Address,
            };
        }

        public List<Sponsor> MapToEntities(SponsorDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<Sponsor> MapToEntities(IEnumerable<SponsorDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
