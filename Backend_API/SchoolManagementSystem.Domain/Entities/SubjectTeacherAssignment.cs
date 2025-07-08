using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class SubjectTeacherAssignment
    {
        [Key]
        public int SubjectTeacherId { get; set; }

        [ForeignKey("Employee")]
        public int? EmployeeId { get; set; }

        [ForeignKey("Subject")]
        public int? SubjectId { get; set; }

        [Required]
        public DateTime? CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;

        // Navigation properties

        public Employee Employee { get; set; }

        public Subject Subject { get; set; }
        public User? CreatedUser { get; set; }
        public User? UpdatedUser { get; set; }
    }
}