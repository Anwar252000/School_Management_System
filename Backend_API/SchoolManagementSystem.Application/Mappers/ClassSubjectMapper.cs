using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;
using System.Collections.Generic;

namespace SchoolManagementSystem.Application.Mappers
{
    public class ClassSubjectMapper : IMapper<ClassSubjectAssignmentDTO, ClassSubject>
    {
        // Maps a DTO to a single ClassSubject entity (if needed in some cases)
        public ClassSubject MapToEntity(ClassSubjectAssignmentDTO dto)
        {
            return new ClassSubject
            {
                ClassSubjectId = dto.ClassSubjectId,
                ClassId = dto.ClassId,
                SubjectId = dto.SubjectIds.FirstOrDefault(),
                IsActive = dto.IsActive
            };
        }

        public List<ClassSubject> MapToEntities(ClassSubjectAssignmentDTO dto)
        {
            var entities = new List<ClassSubject>();

            foreach (var subjectId in dto.SubjectIds)
            {
                entities.Add(new ClassSubject
                {
                    ClassSubjectId = dto.ClassSubjectId,
                    
                    ClassId = dto.ClassId,
                    SubjectId = subjectId, 
                    IsActive = dto.IsActive
                });
            }

            return entities; 
        }

        public ClassSubjectAssignmentDTO MapToDto(ClassSubject entity)
        {
            return new ClassSubjectAssignmentDTO
            {
                ClassSubjectId = entity.ClassSubjectId,
                ClassId = entity.ClassId,
                SubjectName = entity?.Subject?.SubjectName,
                SubjectIds = entity.SubjectId.HasValue ? new List<int> { entity.SubjectId.Value } : new List<int>(),
                IsActive = entity.IsActive
            };
        }

		public List<ClassSubject> MapToEntities(IEnumerable<ClassSubjectAssignmentDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
