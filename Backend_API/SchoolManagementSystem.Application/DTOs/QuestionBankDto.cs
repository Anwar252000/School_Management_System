
namespace SchoolManagementSystem.Application.DTOs
{
    public class QuestionBankDto
    {
        public int? QuestionBankId { get; set; }
        public int ClassId { get; set; }
        public int SubjectId { get; set; }
        public string QuestionType { get; set; }
        public string Questions { get; set; }
        public int Marks { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public bool? IsActive { get; set; } = true;
        public string? ClassName { get; set; }
        public string? SubjectName { get; set; }
    }
}
