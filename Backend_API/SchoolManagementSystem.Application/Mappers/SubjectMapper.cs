using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class SubjectMapper : IMapper<SubjectDTO, Subject>
    {


        public Subject MapToEntity(SubjectDTO dto)
        {
            return new Subject
            {
                SubjectId = dto.SubjectId,
                SubjectName = dto.SubjectName,
                SubjectDescription = dto.SubjectDescription,
                CreatedBy = dto.CreatedBy,
                UpdatedBy = dto.UpdatedBy,
            };
        }
        public SubjectDTO MapToDto(Subject entity)
        {
            return new SubjectDTO
            {
                SubjectId = entity.SubjectId,
                SubjectName = entity.SubjectName,
                SubjectDescription = entity.SubjectDescription,
                CreatedBy = entity.CreatedBy,
                UpdatedBy = entity.UpdatedBy,

            };
        }

        public List<Subject> MapToEntities(SubjectDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<Subject> MapToEntities(IEnumerable<SubjectDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
