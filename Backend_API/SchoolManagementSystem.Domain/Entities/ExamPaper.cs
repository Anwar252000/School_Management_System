using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


namespace SchoolManagementSystem.Domain.Entities
{
    public class ExamPaper
    {
        [Key]
        public int? ExamPaperId { get; set; }

        [ForeignKey("Class")]
        public int? ClassId { get; set; }

        [ForeignKey("Subject")]
        public int? SubjectId { get; set; }

        [ForeignKey("QuestionsBank")]
        public int? QuestionId { get; set; }

        [Required]
        public string? TermName { get; set; }

        [Required]
        public int? TotalMarks { get; set; }

        public int? DictationMarks {  get; set; }

        public int? OralMarks {  get; set; }

        public int? WrittenMarks { get; set; }

        public int? CopyMarks { get; set; }

        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;

        // Navigation properties

        public Class? Class { get; set; }
        public Subject Subject { get; set; }
        public QuestionBank QuestionsBank { get; set; }
        public User? CreatedUser { get; set; }
        public User? UpdatedUser { get; set; }

    }
}
