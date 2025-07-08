using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class PeriodMapper : IMapper<PeriodDTO, Period>
    {

        public Period MapToEntity(PeriodDTO dto)
        {
            return new Period
            {
                PeriodId = dto.PeriodId,
                PeriodName = dto.PeriodName,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                CreatedAt = dto.CreatedAt,
                CreatedBy = dto.CreatedBy,
            };
        }
        public PeriodDTO MapToDto(Period entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            return new PeriodDTO
            {
                PeriodId = entity.PeriodId,
                PeriodName = entity.PeriodName,
                StartTime = entity.StartTime,
                EndTime = entity.EndTime,
            };
        }

        public List<Period> MapToEntities(PeriodDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<Period> MapToEntities(IEnumerable<PeriodDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
