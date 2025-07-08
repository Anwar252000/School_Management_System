namespace SchoolManagementSystem.Application.DTOs.Library
{
    public class BookPurchaseDTO
    {
        public int BookPurchaseId { get; set; }
        public int? BookId { get; set; }
        public string? BookTitle { get; set; }
        public string? PurchasedBy { get; set; }
        public int? Price { get; set; }
        public int? Quantity { get; set; }

        public DateTime? PurchaseDate { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public bool IsActive { get; set; }
    }
}
