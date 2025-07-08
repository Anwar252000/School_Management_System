using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class AcademicYear
    {
        [Key]
        public int AcademicYearId { get; set; }

        [MaxLength(12)]
        public string? AcademicYearName { get; set; }

        [Required]
        public DateTime StartYear { get; set; }

        [Required]
        public DateTime EndYear { get; set; }

        public int? StudentId { get; set; }

        public int? StudentAcademicId { get; set; }

        public int? ExamPaperId { get; set; }

        public int? ExamResultId { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;

        // Navigation Properties
        public User? CreatedUser { get; set; }
        public User? UpdatedUser { get; set; }
        public Student? Student { get; set; }
        public StudentAcademic? StudentAcademic { get; set; }
        public ExamPaper? ExamPaper { get; set; }
        public ExamResult? ExamResult { get; set; }
    }
}
