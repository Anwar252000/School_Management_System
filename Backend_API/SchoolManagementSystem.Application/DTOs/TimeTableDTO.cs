using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.DTOs
{
    public class TimeTableDTO
    {
        public int? TimetableId { get; set; }

        public int CampusId { get; set; }

        public int ClassId { get; set; }

        public int SubjectId { get; set; }

        public int PeriodId { get; set; }

        public string? DayOfWeek { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int? CreatedBy { get; set; }

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; } = true;
        public string? CampusName { get; set; }
        public string? ClassName { get; set; }
        public string? SubjectName { get; set; }
        public string? PeriodName { get; set; }
        public TimeSpan? StartTime { get; set; }
        public TimeSpan? EndTime { get; set; }
    }
}
