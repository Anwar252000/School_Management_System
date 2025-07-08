using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class TimeTable
    {
        [Key]
        public int? TimeTableId { get; set; }

        [ForeignKey("Campus")]
        public int CampusId { get; set; }

        [ForeignKey("Class")]
        public int ClassId { get; set; }

        [ForeignKey("Subject")]
        public int SubjectId { get; set; }

        [ForeignKey("Period")]
        public int PeriodId { get; set; }

        public string? DayOfWeek { get; set; }

        [Required]
        public DateTime? CreatedAt { get; set; }

        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public User? CreatedUser { get; set; }
        public User? UpdatedUser { get; set; }
        public Campus? Campus { get; set; }
        public Class? Class { get; set; }
        public Subject? Subject { get; set; }
        public Period? Period { get; set; }
    }
}
