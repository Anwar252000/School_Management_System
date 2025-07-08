using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class SubjectTeacherAssignmentMapper : IMapper<SubjectTeacherAssignmentDTO, SubjectTeacherAssignment>
    {
        public SubjectTeacherAssignment MapToEntity(SubjectTeacherAssignmentDTO dto)
        {
            return new SubjectTeacherAssignment
            {
                SubjectTeacherId = dto.SubjectTeacherId,
                //SubjectId = dto.SubjectId,
                SubjectId = dto.SubjectIds.FirstOrDefault(),

                EmployeeId = dto.EmployeeId,
                IsActive = dto.IsActive,
            };
        }
        public SubjectTeacherAssignmentDTO MapToDto(SubjectTeacherAssignment entity)
        {
            return new SubjectTeacherAssignmentDTO
            {
                SubjectTeacherId = entity.SubjectTeacherId,
                //SubjectId = entity.SubjectId,
                SubjectIds = entity.SubjectId.HasValue ? new List<int> { entity.SubjectId.Value } : new List<int>(),

                EmployeeId = entity.EmployeeId,
                EmployeeRoleName = entity.Employee.EmployeeRole.RoleName,
                SubjectName = entity.Subject.SubjectName,
                EmployeeName = $"{entity.Employee.FirstName} {entity.Employee.LastName}",
                IsActive = entity.IsActive,

            };
        }

        public List<SubjectTeacherAssignment> MapToEntities(SubjectTeacherAssignmentDTO dto)
        {
            var entities = new List<SubjectTeacherAssignment>();

            foreach (var subjectId in dto.SubjectIds)
            {
                entities.Add(new SubjectTeacherAssignment
                {
                    SubjectTeacherId = dto.SubjectTeacherId,
                    EmployeeId = dto.EmployeeId,
                    SubjectId = subjectId,
                    IsActive = dto.IsActive
                });
            }

            return entities;
        }

		public List<SubjectTeacherAssignment> MapToEntities(IEnumerable<SubjectTeacherAssignmentDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
