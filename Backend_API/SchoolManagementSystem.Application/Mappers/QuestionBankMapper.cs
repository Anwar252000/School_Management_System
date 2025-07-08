using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class QuestionBankMapper : IMapper<QuestionBankDto, QuestionBank>
    {


        public QuestionBank MapToEntity(QuestionBankDto dto)
        {
            return new QuestionBank
            {
                QuestionBankId = dto.QuestionBankId,
                ClassId = dto.ClassId,
                SubjectId = dto.SubjectId,
                QuestionType = dto.QuestionType,
                Questions = dto.Questions,
                Marks = dto.Marks,                
                CreatedAt = DateTime.UtcNow,
                CreatedBy = dto.CreatedBy,
            };
        }
        public QuestionBankDto MapToDto(QuestionBank entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            return new QuestionBankDto
            {
                QuestionBankId = entity.QuestionBankId,
                ClassId = entity.ClassId,
                SubjectId = entity.SubjectId,
                QuestionType = entity.QuestionType,
                Questions = entity.Questions,
                Marks = entity.Marks,
                ClassName = entity?.Class?.ClassName,
                SubjectName = entity?.Subject?.SubjectName
            };
        }

        public List<QuestionBank> MapToEntities(QuestionBankDto dto)
        {
            throw new NotImplementedException();
        }

		public List<QuestionBank> MapToEntities(IEnumerable<QuestionBankDto> dto)
		{
			throw new NotImplementedException();
		}
	}
}
