using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class AcademicYearMapper : IMapper<AcademicYearDTO, AcademicYear>
    {
        public AcademicYear MapToEntity(AcademicYearDTO dto)
        {
            if (dto == null)
            {
                throw new ArgumentNullException(nameof(dto));
            }

            return new AcademicYear
            {
                AcademicYearId = dto.AcademicYearId,
                AcademicYearName = dto.AcademicYearName,
                StartYear = dto.StartYear,
                EndYear = dto.EndYear,
                StudentId = dto.StudentId,
                StudentAcademicId = dto.StudentAcademicId,
                ExamPaperId = dto.ExamPaperId,
                ExamResultId = dto.ExamResultId,
                CreatedAt = dto.CreatedAt,
                CreatedBy = dto.CreatedBy,
                IsActive = dto.IsActive
            };
        }

        public AcademicYearDTO MapToDto(AcademicYear entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            return new AcademicYearDTO
            {
                AcademicYearId = entity.AcademicYearId,
                AcademicYearName = entity.AcademicYearName,
                StartYear = entity.StartYear,
                EndYear = entity.EndYear,
                StudentId = entity.StudentId,
                StudentAcademicId = entity.StudentAcademicId,
                ExamPaperId = entity.ExamPaperId,
                ExamResultId = entity.ExamResultId,
                CreatedAt = entity.CreatedAt = DateTime.UtcNow,
                CreatedBy = entity.CreatedBy,
                IsActive = entity.IsActive,
                StudentName = $"{entity.Student?.FirstName} {entity.Student?.LastName}" // Example, if Student is not null
            };
        }

        public List<AcademicYear> MapToEntities(AcademicYearDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<AcademicYear> MapToEntities(IEnumerable<AcademicYearDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
