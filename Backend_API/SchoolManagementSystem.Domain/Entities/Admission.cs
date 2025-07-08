using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class Admission
    {
        [Key]
        public int AdmissionId { get; set; }

        [Required]
        public int StudentId { get; set; }

        [Required]
        public int ApplicationId { get; set; }

        [Required]
        public DateTime AdmissionDate { get; set; }

        [Required]
        public int ClassId { get; set; }

        [Required]
        public int SectionId { get; set; }

        // Navigation Properties
        [ForeignKey("StudentId")]
        public virtual Student Student { get; set; }

        [ForeignKey("ApplicationId")]
        public virtual AdmissionApplication Application { get; set; }

        [ForeignKey("ClassId")]
        public virtual Class Class { get; set; }

        [ForeignKey("SectionId")]
        public virtual Section Section { get; set; }
    }
}
