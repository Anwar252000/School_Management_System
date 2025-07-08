using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class StudentParent
    {
        public int StudentParentId { get; set; }
        [ForeignKey("Parent")]
        public int? ParentId { get; set; }
        [ForeignKey("Student")]
        public int? StudentId { get; set; }
        [ForeignKey("Applicant")]
        public int? ApplicantId { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }
        [Required]
        public bool IsActive { get; set; }

        //Navigation Property
        public User? CreatedUser { get; set; }
        public User? UpdatedUser { get; set; }
        public Parent? Parent { get; set; }
        public Student? Student { get; set; }
        public Applicant? Applicant { get; set; }
    }
}
