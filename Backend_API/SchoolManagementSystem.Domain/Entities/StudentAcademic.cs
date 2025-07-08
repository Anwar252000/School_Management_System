using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class StudentAcademic
    {
        [Key]
        public int StudentAcademicId { get; set; }


        [ForeignKey("Student")]
        public int StudentId { get; set; }

        [ForeignKey("Campus")]

        public int? CampusId { get; set; }

        [ForeignKey("Class")]

        public int? ClassId { get; set; }

        [ForeignKey("Section")]

        public int? SectionId { get; set; }

        [StringLength(10)]
        public string? AcademicYear { get; set; }

        public bool IsPromoted { get; set; }

        public DateTime? PromotionDate { get; set; }

        [StringLength(700)]
        public string? Remarks { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public int? UpdatedBy { get; set; }

        public bool IsActive { get; set; } = true;

        public bool IsStudied { get; set; }

        //Navigation properties
        public Student? Student { get; set; }
        public Campus? Campus { get; set; }
        public Class? Class { get; set; }
        public Section? Section { get; set; }
    }
}
