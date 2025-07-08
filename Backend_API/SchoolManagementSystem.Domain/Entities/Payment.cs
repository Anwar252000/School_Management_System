using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }

        [ForeignKey("Sponsorship")]
        public int? SponsorshipId { get; set; }
        [Required]
        public DateOnly? PaymentDate { get; set; }
        [Required]
        [MaxLength(10)]
        public decimal? AmountPaid { get; set; }
        [Required]
        public string? PaymentMethod { get; set; }
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
        public Sponsorship? Sponsorship { get; set; }
    }
}
