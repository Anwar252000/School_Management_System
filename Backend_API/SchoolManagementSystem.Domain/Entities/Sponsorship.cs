using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class Sponsorship
    {
        [Key]
        public int? SponsorshipId { get; set; }

        [Required]
        public decimal? Amount { get; set; }

        [Required]
        public DateOnly? StartDate { get; set; }

        [Required]
        public int? Frequency { get; set; }

        public int? SponsorId { get; set; }

        [Required]
        public DateTime? CreatedAt { get; set; } = DateTime.Now;

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
        public Sponsor? Sponsor { get; set; }
        public ICollection<SponsorshipDetail> SponsorshipDetails { get; set; }
    }
}
