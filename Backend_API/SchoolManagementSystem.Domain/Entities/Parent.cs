
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class Parent
    {
        [Key]
        public int? ParentId { get; set; }

        [MaxLength(50)]
        public string? FirstName { get; set; }

        [MaxLength(50)]
        public string? MiddleName { get; set; }

        [MaxLength(50)]
        public string? LastName { get; set; }

        [MaxLength(50)]
        public string? MotherTongue { get; set; } // Missing field

        //[MaxLength(50)]
        //public string? State { get; set; } // Missing field

        [MaxLength(100)]
        public string? Email { get; set; }

        [MaxLength(15)]
        public string? PhoneNumber { get; set; }

        [MaxLength(50)]
        public string? SourceOfIncome { get; set; }

        [MaxLength(50)]
        public string? Occupation { get; set; }

        [MaxLength(50)]
        public string? Nationality { get; set; }

        [MaxLength(50)]
        public string? ResidenceStatus { get; set; } // Fixed typo & added

        [MaxLength(255)]
        public string? ParentAddress { get; set; }
        public string? Dependent { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public User CreatedUser { get; set; }
        public User UpdatedUser { get; set; }
    }

}
