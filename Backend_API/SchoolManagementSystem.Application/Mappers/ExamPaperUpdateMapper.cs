using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;
using System.Collections.Generic;

namespace SchoolManagementSystem.Application.Mappers
{
    public class ExamPaperUpdateMapper : IMapper<ExamPaperUpdateDTO, ExamPaper>
    {
        public ExamPaper MapToEntity(ExamPaperUpdateDTO dto)
        {
            return new ExamPaper
            {
               
            };
        }

        public List<ExamPaper> MapToEntities(ExamPaperUpdateDTO dto)
        {
            var entities = new List<ExamPaper>();

            if (dto.QuestionIds != null && dto.QuestionIds.Any())
            {
                for (int i = 0; i < dto.QuestionIds.Count; i++)
                {
                    var examPaperId = dto.ExamPaperIds != null && i < dto.ExamPaperIds.Count
                        ? dto.ExamPaperIds[i]
                        : (int?)null; 

                    entities.Add(new ExamPaper
                    {
                        ExamPaperId = examPaperId, 
                        ClassId = dto.ClassId,
                        SubjectId = dto.SubjectId,
                        QuestionId = dto.QuestionIds[i],
                        TermName = dto.TermName,
                        TotalMarks = dto.TotalMarks,
                        DictationMarks = dto.DictationMarks,
                        OralMarks = dto.OralMarks,
                        WrittenMarks = dto.WrittenMarks,
                        CopyMarks = dto.CopyMarks,
                        IsActive = dto.IsActive
                    });
                }
            }

            return entities;
        }

        public ExamPaperUpdateDTO MapToDto(ExamPaper entity)
        {
            return new ExamPaperUpdateDTO
            {
                
            };
        }

		public List<ExamPaper> MapToEntities(IEnumerable<ExamPaperUpdateDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
