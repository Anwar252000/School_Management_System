namespace SchoolManagementSystem.Application.DTOs.Fee
{
    public class ApplyDiscountDto
    {
        public int StudentId { get; set; }
        public decimal DiscountAmount { get; set; }
        public string Reason { get; set; }
        public int CreatedBy { get; set; }

    }
}
