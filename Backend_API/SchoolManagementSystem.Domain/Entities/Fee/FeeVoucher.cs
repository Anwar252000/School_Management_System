

using System.ComponentModel.DataAnnotations;

namespace SchoolManagementSystem.Domain.Entities.Fee
{
    public class FeeVoucher
    {
        [Key]
        public int VoucherId { get; set; }
        public int StudentId { get; set; }
        public int CampusId { get; set; }
        public string FeeMonth { get; set; }
        public int FeeYear { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime DueDate { get; set; }
        public bool Paid { get; set; }
        public int? LateFee { get; set; }
        public bool IsActive { get; set; }

        public DateTime PaymentDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
    }
}
