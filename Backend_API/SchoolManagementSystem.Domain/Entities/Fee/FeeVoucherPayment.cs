namespace SchoolManagementSystem.Domain.Entities.Fee
{
    public class FeeVoucherPayment
    {
        public int FeeVoucherPaymentId { get; set; }
        public int VoucherId { get; set; }
        public decimal PaymentAmount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string PaymentMethod { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CreatedBy { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int UpdatedBy { get; set; }
        public bool IsActive { get; set; }
    }
}
