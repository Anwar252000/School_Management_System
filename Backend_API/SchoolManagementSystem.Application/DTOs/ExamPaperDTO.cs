using SchoolManagementSystem.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SchoolManagementSystem.Application.DTOs
{
    public class ExamPaperDTO
    {
        public int? ExamPaperId { get; set; }
        public int? ClassId { get; set; }
        public int? SubjectId { get; set; }
        public List<int>? QuestionIds { get; set; } = new List<int>();
        public string? TermName { get; set; }
        public int? TotalMarks { get; set; }
        public int? DictationMarks { get; set; }
        public int? OralMarks { get; set; }
        public int? WrittenMarks { get; set; }
        public int? CopyMarks { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; } = DateTime.Now;
        public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; } = true;
        public string? ClassName { get; set; }
        public string? SubjectName { get; set; }
        public string? QuestionType { get; set; }
        public string? Questions { get; set; }
        public int? Marks { get; set; }
    }
}
