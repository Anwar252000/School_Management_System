namespace SchoolManagementSystem.Application.DTOs.Library
{
    public class BookIssueDTO
    {
        public int BookIssueId { get; set; }
        public int? BookId { get; set; }
        public string? BookTitle { get; set; }
        public string? IssuedTo { get; set; }
        public DateTime? IssueDate { get; set; }
        public int? AdvancePayment { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public bool IsActive { get; set; }
    }
}
