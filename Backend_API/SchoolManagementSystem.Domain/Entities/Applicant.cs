using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class Applicant
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ApplicantId { get; set; }

        [MaxLength(100)]
        public string FirstName { get; set; }

        [MaxLength(100)]
        public string LastName { get; set; }

        [MaxLength(15)]
        public string FormBNumber { get; set; }

        public DateOnly? DateOfBirth { get; set; }

        [MaxLength(10)]
        public string? Gender { get; set; }

        //[MaxLength(100)]
        //public string Email { get; set; }

        //[MaxLength(15)]
        //public string? PhoneNumber { get; set; }

        //[MaxLength(255)]
        //public string ApplicantAddress { get; set; }

        //[MaxLength(30)]
        //public string ResidenceStatus { get; set; }

        //[MaxLength(50)]
        //public string City { get; set; }

        //[MaxLength(50)]
        //public string MotherTounge { get; set; }

        //[MaxLength(30)]
        //public string States { get; set; }

        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; } = true;


        //Navigation Properties
        public virtual AdmissionApplication? Application { get; set; }

        [ForeignKey("CreatedBy")]
        public virtual User CreatedByUser { get; set; }

        [ForeignKey("UpdatedBy")]
        public virtual User UpdatedByUser { get; set; }

    }
}
