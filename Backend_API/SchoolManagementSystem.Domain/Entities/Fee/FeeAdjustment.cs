using System.ComponentModel.DataAnnotations;

namespace SchoolManagementSystem.Domain.Entities.Fee
{
    public class FeeAdjustment
    {
        [Key]
        public int AdjustmentId { get; set; }
        public int StudentId { get; set; }
        public int VoucherId { get; set; }
        public decimal AdjustmentAmount { get; set; }
        public string Reason { get; set; }
        public DateTime AdjustmentDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CreatedBy { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int UpdatedBy { get; set; }
        public bool IsActive { get; set; }
    }
}
