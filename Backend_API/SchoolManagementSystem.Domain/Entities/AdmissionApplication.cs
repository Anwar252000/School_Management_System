using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    [Table("Applications")]
    public class AdmissionApplication
    {

        [Key]
        public int ApplicationId { get; set; }

        public int ApplicantId { get; set; }
        [ForeignKey(nameof(ApplicantId))]

        public int? CampusId { get; set; }
        [ForeignKey(nameof(CampusId))]
        
        public int? LastClassId { get; set; }
        [ForeignKey(nameof(LastClassId))]

        public int? AppliedClassId { get; set; }
        [ForeignKey(nameof(AppliedClassId))]

        [MaxLength(50)]
        public string? ApplicationStatus { get; set; }

        public DateOnly? AdmissionDecisionDate { get; set; }

        [MaxLength(255)]
        public string? Remarks { get; set; }

        public DateTime? CreatedAt { get; set; } = DateTime.Now;

        public int? CreatedBy { get; set; }
        [ForeignKey(nameof(CreatedBy))]
        public virtual User CreatedByUser { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public int? UpdatedBy { get; set; }
        [ForeignKey(nameof(UpdatedBy))]
        public virtual User UpdatedByUser { get; set; }

        public bool IsActive { get; set; } = true;

        public virtual Applicant Applicant { get; set; }
        public virtual Campus Campus { get; set; }
        public virtual Class Class { get; set; }
    }
}
