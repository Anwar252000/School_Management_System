namespace SchoolManagementSystem.Application.DTOs
{
    public class ParentFeedbackDTO
    {
        public int ParentFeedbackId { get; set; }
        public int? ParentId { get; set; }
        public string? ParentName { get; set; }
        public string? StudentName { get; set; }
        public int? StudentId { get; set; }
        public string? FeedbackText { get; set; }
        public DateOnly? DateSubmitted { get; set; }
        public int? CreatedBy { get; set; }
        public bool IsActive { get; set; }
    }
}
