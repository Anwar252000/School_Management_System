using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class ExamMapper : IMapper<ExamDTO, Exam>
    {
        public Exam MapToEntity(ExamDTO dto)
        {
            return new Exam
            {
                ExamId = dto.ExamId,
                CampusId = dto.CampusId,
                ExamPaperId = dto.ExamPaperId,
                ClassId = dto.ClassId,
                SubjectId = dto.SubjectId,
                ExamDate = dto.ExamDate,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                PassingMarks = dto.PassingMarks,
                IsActive = dto.IsActive
            };
        }

        public List<Exam> MapToEntities(ExamDTO dto)
        {
            var entities = new List<Exam>();
           
            return entities;
        }

        public ExamDTO MapToDto(Exam entity)
        {
            return new ExamDTO
            {
                ExamId = entity.ExamId,
                CampusId = entity.CampusId,
                ExamPaperId = entity.ExamPaperId,
                ClassId = entity.ClassId,
                SubjectId = entity.SubjectId,
                ExamDate = entity.ExamDate,
                StartTime = entity.StartTime,
                EndTime = entity.EndTime,
                PassingMarks = entity.PassingMarks,
                CampusName = entity.Campus?.CampusName,
                ClassName = entity?.Class?.ClassName,
                SubjectName = entity?.Subject?.SubjectName,
                TermName = entity?.ExamPaper?.TermName,
                IsActive = entity.IsActive,
            };
        }

		public List<Exam> MapToEntities(IEnumerable<ExamDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
