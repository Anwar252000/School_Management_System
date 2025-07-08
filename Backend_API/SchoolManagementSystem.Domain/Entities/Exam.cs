using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SchoolManagementSystem.Domain.Entities
{
    public class Exam
    {
        [Key]
        public int? ExamId { get; set; }

        [ForeignKey("Campus")]
        public int? CampusId { get; set; }

        [ForeignKey("Class")]
        public int? ClassId { get; set; }

        [ForeignKey("Subject")]
        public int? SubjectId { get; set; }

        [ForeignKey("ExamPaper")]
        public int? ExamPaperId { get; set; }

        [Required]
        public DateOnly? ExamDate { get; set; }

        [Required]
        public TimeSpan? StartTime { get; set; }

        [Required]
        public TimeSpan? EndTime { get; set; }

        [Required]
        public int? PassingMarks { get; set; }

        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;

        // Navigation properties

        public Campus? Campus { get; set; }
        public Class? Class { get; set; }
        public Subject? Subject { get; set; }
        public ExamPaper? ExamPaper { get; set; }
        public User? CreatedUser { get; set; }
        public User? UpdatedUser { get; set; }

    }
}
