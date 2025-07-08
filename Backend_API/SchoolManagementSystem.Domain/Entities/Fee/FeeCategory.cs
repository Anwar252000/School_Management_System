using System.ComponentModel.DataAnnotations;

namespace SchoolManagementSystem.Domain.Entities.Fee
{
    public class FeeCategory
    {
        [Key]
        public int FeeCategoryId { get; set; }

        [StringLength(100)]
        public string FeeName { get; set; }

        [StringLength(255)]
        public string FeeDescription { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public int? UpdatedBy { get; set; }

    }
}
