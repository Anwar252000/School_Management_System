using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class StudentParentMapper : IMapper<StudentParentDTO, StudentParent>
    {
        public StudentParent MapToEntity(StudentParentDTO dto)
        {
            return new StudentParent
            {
                StudentParentId = dto.StudentParentId,
                ParentId = dto.ParentId,
                StudentId = dto.StudentId,
                ApplicantId = dto.ApplicantId,

                CreatedBy = dto.CreatedBy,
                IsActive = dto.IsActive,
            };
        }

        public StudentParentDTO MapToDto(StudentParent entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            return new StudentParentDTO
            {
                StudentParentId = entity.StudentParentId,
                ParentId = entity.ParentId,
                StudentId = entity.StudentId,
                ParentName = entity.Parent.FirstName + " " + entity.Parent.LastName,
                StudentName = entity.Student.FirstName + " " + entity.Student.LastName,
                ApplicantId = entity.ApplicantId,
                CreatedBy = entity.CreatedBy,
                IsActive = entity.IsActive = true,
            };
        }

        public List<StudentParent> MapToEntities(StudentParentDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<StudentParent> MapToEntities(IEnumerable<StudentParentDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
