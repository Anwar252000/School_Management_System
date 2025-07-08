namespace SchoolManagementSystem.Domain.Entities
{
    public class PaymentDTO
    {

        public int PaymentId { get; set; }
        public int? SponsorshipId { get; set; }
        public string? SponsorName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        public decimal? SponsorshipAmount { get; set; }

        public DateOnly? PaymentDate { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        public decimal? AmountPaid { get; set; }
        public string? PaymentMethod { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
