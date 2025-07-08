


using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class StudentAcademicMapper : IMapper<StudentAcademicDTO, StudentAcademic>
    {


        public StudentAcademic MapToEntity(StudentAcademicDTO dto)
        {
            return new StudentAcademic
            {
                StudentAcademicId = dto.StudentAcademicId,
                StudentId = dto.StudentId,
                ClassId = dto.ClassId,
                SectionId = dto.SectionId,
                CampusId = dto.CampusId,
                AcademicYear = dto.AcademicYear,
                IsPromoted = dto.IsPromoted,
                PromotionDate = dto.PromotionDate,
                Remarks = dto.Remarks,
                CreatedAt = dto.CreatedAt = DateTime.UtcNow,
                CreatedBy = dto.CreatedBy,
                IsStudied = dto.IsStudied,
                IsActive = dto.IsActive,

            };
        }
        public StudentAcademicDTO MapToDto(StudentAcademic entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            return new StudentAcademicDTO
            {
                StudentAcademicId = entity.StudentAcademicId,
                StudentId = entity.StudentId,
                StudentName = entity.Student?.FirstName + " " + entity.Student?.LastName,
                CampusName = entity.Campus?.CampusName,
                AcademicYear = $"{DateTime.Now.Year}-{DateTime.Now.Year + 1}",
                IsPromoted = entity.IsPromoted = true,
                PromotionDate = entity.PromotionDate = DateTime.UtcNow,
                IsStudied = entity.IsStudied = true,
                Remarks = entity.Remarks,
                EnrollmentDate = entity.Student.EnrollmentDate,
                CampusId = entity.CampusId,
                ClassId = entity.ClassId,
                SectionId = entity.SectionId,
                SectionName = entity.Section?.SectionName,
                ClassName = entity.Class?.ClassName,
                CreatedAt = entity.CreatedAt = DateTime.UtcNow,
                CreatedBy = entity.CreatedBy,
                IsActive = entity.IsActive = true,


            };
        }

        public List<StudentAcademic> MapToEntities(StudentAcademicDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<StudentAcademic> MapToEntities(IEnumerable<StudentAcademicDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
