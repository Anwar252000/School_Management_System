using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class Sponsor
    {
        [Key]
        public int SponsorId { get; set; }

        [Required]
        public string? SponsorName { get; set; }

        [Required]
        [MaxLength(50)]
        public string Email { get; set; }

        [Required]
        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        [Required]
        [MaxLength(10)]
        public string? Gender { get; set; }

        [Required]
        [MaxLength(50)]
        public string? Occupation { get; set; }

        [Required]
        [MaxLength(30)]
        public string? Country { get; set; }

        [Required]
        [MaxLength(30)]
        public string? State { get; set; }

        [Required]
        [MaxLength(30)]
        public string? City { get; set; }

        [Required]
        [MaxLength(20)]
        public int PostalCode { get; set; }

        [Required]
        [MaxLength(255)]
        public string? Address { get; set; }

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

    }
}
