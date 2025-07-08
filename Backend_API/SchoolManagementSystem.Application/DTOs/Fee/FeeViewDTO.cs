namespace SchoolManagementSystem.Application.DTOs.Fee
{
    public class FeeViewDTO
    {
        public int StudentId { get; set; }
        public string FullName { get; set; }
        public int GrNo { get; set; }
        public string CampusName { get; set; }
        public int VoucherId { get; set; }
        public string FeeMonth { get; set; }
        public int FeeYear { get; set; }
        public decimal TotalFees { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal PendingAmount { get; set; }
        public DateTime DueDate { get; set; }
        public string PaymentStatus { get; set; }
        public decimal DiscountAmount { get; set; }
        public string SponsorName { get; set; }
    }
}
