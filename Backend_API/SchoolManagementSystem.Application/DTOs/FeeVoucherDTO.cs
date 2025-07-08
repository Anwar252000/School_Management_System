
namespace SchoolManagementSystem.Application.DTOs
{
    public class FeeVoucherDTO
    {
        public int VoucherId { get; set; }

        public int StudentId { get; set; }

        public int CampusId { get; set; }

        public string FeeMonth { get; set; }

        public int FeeYear { get; set; }

        public int TotalAmount { get; set; }

        public DateTime DueDate { get; set; }

        public bool Paid { get; set; }

        public DateTime PaymentDate { get; set; }

        public int LateFee { get; set; }

        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;

        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public int? UpdatedBy { get; set; }

        public bool IsActive { get; set; }
    }
}
