namespace SchoolManagementSystem.Application.DTOs
{
    public class GradeDTO
    {
        public int GradeId { get; set; }
        public string GradeName { get; set; }
        public DateOnly DateAwarded { get; set; }
        public int StudentId { get; set; }
        public string? StudentName { get; set; }
        public int SubjectId { get; set; }
        public string? SubjectName { get; set; }

        public DateTime CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; }
    }
}
