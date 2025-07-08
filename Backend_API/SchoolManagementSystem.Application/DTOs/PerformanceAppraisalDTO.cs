namespace SchoolManagementSystem.Application.DTOs
{
    public class PerformanceAppraisalDTO
    {
        public int AppraisalId { get; set; }
        public int? EmployeeId { get; set; }
        public string? EmployeeName { get; set; }
        public DateTime? AppraisalDate { get; set; }
        public int? PerformanceScore { get; set; }
        public string? Comments { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? CreatedBy { get; set; }

        public bool IsActive { get; set; }
    }
}
