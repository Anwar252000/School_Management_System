using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.DTOs
{
    public class PeriodDTO
    {
        public int? PeriodId { get; set; }
        public string? PeriodName { get; set; }
        public TimeSpan? StartTime { get; set; }
        public TimeSpan? EndTime { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; } = true;

    }
}
