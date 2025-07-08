using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class ApplicantMapper : IMapper<ApplicantDTO, Applicant>
    {
        public ApplicantDTO MapToDto(Applicant entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            return new ApplicantDTO
            {
                ApplicantId = entity.ApplicantId,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                FormBNumber = entity.FormBNumber,
                DateOfBirth = entity.DateOfBirth,
                Gender = entity.Gender,
                //Email = entity.Email,
                //PhoneNumber = entity.PhoneNumber,
                //ApplicantAddress = entity.ApplicantAddress,
                //ResidenceStatus = entity.ResidenceStatus,
                //City = entity.City,
                //MotherTounge = entity.MotherTounge,
                //States = entity.States,
                //CreatedAt = entity.CreatedAt,
                //CreatedBy = entity.CreatedBy,
                //UpdatedAt = entity.UpdatedAt,
                //UpdatedBy = entity.UpdatedBy,
                //IsActive = entity.IsActive,

            };
        }

        public List<Applicant> MapToEntities(ApplicantDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<Applicant> MapToEntities(IEnumerable<ApplicantDTO> dto)
		{
			throw new NotImplementedException();
		}

		public Applicant MapToEntity(ApplicantDTO dto)
        {
            if (dto == null)
            {
                throw new ArgumentNullException(nameof(dto));
            }

            return new Applicant
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                FormBNumber = dto.FormBNumber,
                DateOfBirth = dto.DateOfBirth,
                Gender = dto.Gender,
                //Email = dto.Email,
                //PhoneNumber = dto.PhoneNumber,
                //ApplicantAddress = dto.ApplicantAddress,
                //ResidenceStatus = dto.ResidenceStatus,
                //City = dto.City,
                //IsActive= dto.IsActive,
                ApplicantId = dto.ApplicantId,
                //MotherTounge = dto.MotherTounge,
                //States = dto.States
            };

        }
    }
}
