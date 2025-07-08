using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class ClassSectionAssignmentMapper : IMapper<ClassSectionAssignmentDTO, ClassSectionAssignment>
    {
        public ClassSectionAssignment MapToEntity(ClassSectionAssignmentDTO dto)
        {
            return new ClassSectionAssignment
            {
                AssignmentId = dto.AssignmentId,
                CampusId = dto.CampusId,
                ClassId = dto.ClassId,
                SectionId = dto.SectionId,
                ClassroomId = dto.ClassroomId,
                IsActive = dto.IsActive,
            };
        }
        public ClassSectionAssignmentDTO MapToDto(ClassSectionAssignment entity)
        {
            return new ClassSectionAssignmentDTO
            {
                AssignmentId = entity.AssignmentId,
                CampusId = entity.CampusId,
                ClassroomId = entity.ClassroomId,
                ClassId = entity.ClassId,
                SectionId = entity.SectionId,
                IsActive = entity.IsActive,
                ClassroomCapacity = entity.Classroom.Capacity,
                ClassCapacity = entity.Class.Capacity,
                SectionCapacity = entity.Section?.Capacity ?? 0

            };
        }

        public List<ClassSectionAssignment> MapToEntities(ClassSectionAssignmentDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<ClassSectionAssignment> MapToEntities(IEnumerable<ClassSectionAssignmentDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
