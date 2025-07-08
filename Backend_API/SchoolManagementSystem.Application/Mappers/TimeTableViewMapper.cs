using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class TimeTableViewMapper : IMapper<TimeTableViewDTO, TimeTableView>
    {


        public TimeTableView MapToEntity(TimeTableViewDTO dto)
        {
            return new TimeTableView
            {
                TimetableId = dto.TimetableId,
                DayOfWeek = dto.DayOfWeek,
                CampusName = dto.CampusName,
                ClassName = dto.ClassName,
                SubjectName = dto.SubjectName,
                PeriodName = dto.PeriodName,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
            };
        }
        public TimeTableViewDTO MapToDto(TimeTableView entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            return new TimeTableViewDTO
            {
                TimetableId = entity.TimetableId,
                DayOfWeek = entity.DayOfWeek,
                CampusId = entity.CampusId,
                CampusName = entity.CampusName,
                ClassId = entity.ClassId,
                ClassName = entity.ClassName,
                SubjectId = entity.SubjectId,
                SubjectName = entity.SubjectName,
                PeriodId = entity.PeriodId,
                PeriodName = entity.PeriodName,
                StartTime = entity.StartTime,
                EndTime = entity.EndTime
            };
        }

        public List<TimeTableView> MapToEntities(TimeTableViewDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<TimeTableView> MapToEntities(IEnumerable<TimeTableViewDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
