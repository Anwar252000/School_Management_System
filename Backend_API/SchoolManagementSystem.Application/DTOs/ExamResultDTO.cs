
namespace SchoolManagementSystem.Application.DTOs
{
    public class ExamResultDTO
    {
        public List<ExamDetailsResultDTO>? ExamDetails { get; set; }
        public int? GrNo { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? SubjectName { get; set; }
        public string? ClassName { get; set; }
        public int? ClassId { get; set; }
        public string? TermName { get; set; }
        public int? TotalMarks { get; set; }

        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
