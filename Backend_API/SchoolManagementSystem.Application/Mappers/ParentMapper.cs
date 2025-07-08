using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class ParentMapper : IMapper<ParentDTO, Parent>
    {
        public Parent MapToEntity(ParentDTO dto)
        {
            return new Parent
            {
                ParentId = dto.ParentId,
                FirstName = dto.FirstName,
                MiddleName = dto.MiddleName, // Added
                LastName = dto.LastName,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                MotherTongue = dto.MotherTongue, // Added
                //State = dto.State, // Added
                Nationality = dto.Nationality,
                SourceOfIncome = dto.SourceOfIncome,
                Occupation = dto.Occupation,
                ResidenceStatus = dto.ResidenceStatus, // Added
                ParentAddress = dto.ParentAddress,
                Dependent = dto.Dependent,
                CreatedBy = dto.CreatedBy,
                CreatedAt = dto.CreatedAt,
                IsActive = dto.IsActive,
            };
        }

        public ParentDTO MapToDto(Parent entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            return new ParentDTO
            {
                ParentId = entity.ParentId,
                FirstName = entity.FirstName,
                MiddleName = entity.MiddleName, // Added
                LastName = entity.LastName,
                PhoneNumber = entity.PhoneNumber,
                Email = entity.Email,
                MotherTongue = entity.MotherTongue, // Added
                //State = entity.State, // Added
                Nationality = entity.Nationality,
                SourceOfIncome = entity.SourceOfIncome,
                Occupation = entity.Occupation,
                ResidenceStatus = entity.ResidenceStatus, // Added
                ParentAddress = entity.ParentAddress,
                Dependent = entity.Dependent,
                CreatedBy = entity.CreatedBy,
                CreatedAt = entity.CreatedAt = DateTime.UtcNow,
                //UpdatedBy = entity.UpdatedBy, // Added
                //UpdatedAt = entity.UpdatedAt, // Added
                IsActive = entity.IsActive = true,
            };
        }

        public List<Parent> MapToEntities(ParentDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<Parent> MapToEntities(IEnumerable<ParentDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
