using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class SponsorshipDetail
    {

        [Key]
        public int? SponsorshipDetailId { get; set; }

        [Required]
        public decimal? Amount { get; set; }

        [ForeignKey("Sponsorship")]
        public int? SponsorshipId { get; set; }
        [ForeignKey("Class")]
        public int? ClassId { get; set; }

        [ForeignKey("Student")]
        public int? StudentId { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;

        //Navigation properties
        public User? CreatedUser { get; set; }
        public User? UpdatedUser { get; set; }
        public Class? Class { get; set; }
        public Student? Student { get; set; }
        public Sponsorship? Sponsorship { get; set; }


    }
}

