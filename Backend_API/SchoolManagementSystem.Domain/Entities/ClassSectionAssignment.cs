using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class ClassSectionAssignment
    {
        [Key]
        public int AssignmentId { get; set; }

        [ForeignKey("Class")]
        public int? ClassId { get; set; }

        [ForeignKey("Section")]
        public int? SectionId { get; set; }

        [ForeignKey("Classroom")]
        public int? ClassroomId { get; set; }

        [ForeignKey("Campus")]
        public int? CampusId { get; set; }

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
        public Class Class { get; set; }
        public Section Section { get; set; }
        public Classroom Classroom { get; set; }
        public Campus Campus { get; set; }
        public User CreatedUser { get; set; }
        public User UpdatedUser { get; set; }
    }
}
