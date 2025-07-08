using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class ParentFeedbackMapper : IMapper<ParentFeedbackDTO, ParentFeedback>
    {
        public ParentFeedback MapToEntity(ParentFeedbackDTO dto)
        {
            return new ParentFeedback
            {
                ParentFeedbackId = dto.ParentFeedbackId,
                ParentId = dto.ParentId,
                StudentId = dto.StudentId,
                FeedbackText = dto.FeedbackText,
                DateSubmitted = dto.DateSubmitted,
                CreatedBy = dto.CreatedBy,
                IsActive = dto.IsActive,
            };
        }

        public ParentFeedbackDTO MapToDto(ParentFeedback entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            return new ParentFeedbackDTO
            {
                ParentFeedbackId = entity.ParentFeedbackId,
                ParentId = entity.ParentId,
                StudentId = entity.StudentId,
                FeedbackText = entity.FeedbackText,
                DateSubmitted = entity.DateSubmitted,
                ParentName = entity?.Parent?.FirstName + " " + entity?.Parent?.LastName,
                StudentName = entity?.Student?.FirstName + " " + entity?.Student?.LastName,
                CreatedBy = entity?.CreatedBy,
                IsActive = entity.IsActive,
            };
        }

        public List<ParentFeedback> MapToEntities(ParentFeedbackDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<ParentFeedback> MapToEntities(IEnumerable<ParentFeedbackDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
