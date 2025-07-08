namespace SchoolManagementSystem.Application.DTOs
{
    public class SponsorshipDetailDTO
    {
        public decimal? Amount { get; set; }
        public int? SponsorshipId { get; set; }

        public string? SponsorName { get; set; }

        public int? ClassId { get; set; }
        public int? StudentId { get; set; }
        public string? StudentName { get; set; }
        public string? ClassName { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
