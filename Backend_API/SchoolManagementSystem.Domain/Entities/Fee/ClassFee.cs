using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities.Fee
{
    public class ClassFee
    {
        [Key]
        public int ClassFeeId { get; set; }
        [ForeignKey("Class")]

        public int? ClassId { get; set; }
        [ForeignKey("FeeCategory")]

        public int? FeeCategoryId { get; set; }

        [ForeignKey("CampusId")]

        public int? CampusId { get; set; }
        public decimal? Amount { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey("CreatedUser")]
        public int CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public Class? Class { get; set; }
        public Campus? Campus { get; set; }
        public FeeCategory? FeeCategory { get; set; }
        public User CreatedUser { get; set; }
        public User UpdatedUser { get; set; }

    }
}
