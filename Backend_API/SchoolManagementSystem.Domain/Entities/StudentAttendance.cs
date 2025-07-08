using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class StudentAttendance
    {
        [Key]
        public int? AttendanceId { get; set; }

        [Required]
        [ForeignKey("StudentId")]
        public int? StudentId { get; set; }

        //[Required]
        //[ForeignKey("CampusId")]
        //public int? CampusId { get; set; }

        [Required]
        [ForeignKey("ClassId")]
        public int? ClassId { get; set; }

        [Required]
        [ForeignKey("SectionId")]
        public int? SectionId { get; set; }

        [Required]
        public DateOnly? AttendanceDate { get; set; }

        [MaxLength(20)]
        public string? AttendanceStatus { get; set; }

        public DateTime? CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }
        [Required]
        public bool IsActive { get; set; }

        // Navigation Properties

        public Student? Student { get; set; }
        public Class? Class { get; set; }
        public Section? Section { get; set; }
        public User? CreatedUser { get; set; }
        public User? UpdatedUser { get; set; }
    }
}
