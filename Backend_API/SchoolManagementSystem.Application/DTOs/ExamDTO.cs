using SchoolManagementSystem.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SchoolManagementSystem.Application.DTOs
{
    public class ExamDTO
    {
        public int? ExamId { get; set; }
        public int? CampusId { get; set; }
        public int? ExamPaperId { get; set; }
        public int? ClassId { get; set; }
        public int? SubjectId { get; set; }
        public int? PassingMarks { get; set; }

        public string? CampusName { get; set; }
        public string? SubjectName { get; set; }
        public string? ClassName { get; set; }
        public string? TermName { get; set; }
        public DateOnly? ExamDate { get; set; }
        public TimeSpan? StartTime { get; set; }
        public TimeSpan? EndTime { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; } = DateTime.Now;
        public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
