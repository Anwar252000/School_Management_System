using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class TaskItem
    {
        [Key]
        public int TaskItemId { get; set; }
        public string? TaskName { get; set; }
        public string? TaskDescription { get; set; }
        public string? BeforeImageUrl { get; set; }
        public string? AfterImageUrl { get; set; }
        public string? Priority { get; set; }
        [ForeignKey("AssignedUser")]
        public int? AssignedTo { get; set; }
        public string? Status { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        [ForeignKey("ApprovedUser")]
        public int? ApprovedBy { get; set; }
        public DateTime? DateOfApproval { get; set; }
        public string? NotesAndRemarks { get; set; }

        public DateTime CreatedAt { get; set; }

        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }

        [Required]
        public bool IsActive { get; set; }

        // Navigation properties
        public User? CreatedUser { get; set; }
        public User? UpdatedUser { get; set; }
        public User? ApprovedUser { get; set; }
        public User? AssignedUser { get; set; }
    }

}
