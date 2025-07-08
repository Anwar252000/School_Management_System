using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class Student
    {
        [Key]
        public int StudentId { get; set; }


        public int? GrNo { get; set; }


        [MaxLength(50)]
        public string? FirstName { get; set; }


        [MaxLength(50)]
        public string? LastName { get; set; }


        public DateOnly? DateOfBirth { get; set; }

        [Required]
        [MaxLength(10)]
        public string? Gender { get; set; }

        public DateTime? EnrollmentDate { get; set; }

        [MaxLength(255)]
        public string? ProfileImage { get; set; }

        //[Required]
        //[ForeignKey("ClassId")]
        //public int? ClassId { get; set; }

        //[ForeignKey("SectionId")]
        //public int? SectionId { get; set; }

        //[Required]
        //[ForeignKey("CampusId")]
        //public int? CampusId { get; set; }

        [Required]
        public bool IsActive { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }


        // Navigation Properties

        //public Class? Class { get; set; }
        //public Section? Section { get; set; }
        //public Campus? Campus { get; set; }
        public User? CreatedUser { get; set; }
        public User? UpdatedUser { get; set; }
        public StudentAcademic? Academic { get; set; }

    }
}
