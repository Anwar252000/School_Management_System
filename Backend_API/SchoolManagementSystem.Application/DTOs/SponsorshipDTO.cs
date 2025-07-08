namespace SchoolManagementSystem.Application.DTOs
{
    public class SponsorshipDTO
    {
        public int? SponsorshipId { get; set; }
        public decimal? Amount { get; set; }
        public int? Frequency { get; set; }
        public int? SponsorId { get; set; }
        public DateOnly? StartDate { get; set; }
        public string? SponsorName { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; } = true;
        public List<SponsorshipDetailDTO> Details { get; set; }

    }
}
