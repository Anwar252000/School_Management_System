using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class PerformanceAppraisal
    {
        [Key]
        public int AppraisalId { get; set; }
        [ForeignKey("Employee")]
        public int? EmployeeId { get; set; }
        public DateTime? AppraisalDate { get; set; }
        public int? PerformanceScore { get; set; }
        public string? Comments { get; set; }
        public DateTime? CreatedAt { get; set; }

        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }

        public bool IsActive { get; set; }

        // Navigation properties
        public virtual Employee? Employee { get; set; }
        public User? CreatedUser { get; set; }
        public User? UpdatedUser { get; set; }
    }
}
