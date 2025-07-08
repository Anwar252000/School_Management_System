namespace SchoolManagementSystem.Application.DTOs
{
    public class TaskItemDTO
    {
        public int TaskItemId { get; set; }
        public string? TaskName { get; set; }
        public string? TaskDescription { get; set; }
        public string? BeforeImageUrl { get; set; }
        public string? AfterImageUrl { get; set; }
        public string? Priority { get; set; }
        public int? AssignedTo { get; set; }
        public string? AssignedUserName { get; set; }
        public string? Status { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? ApprovedBy { get; set; }
        public string? ApprovedByUserName { get; set; }
        public DateTime? DateOfApproval { get; set; }
        public string? NotesAndRemarks { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsActive { get; set; }
    }

}
