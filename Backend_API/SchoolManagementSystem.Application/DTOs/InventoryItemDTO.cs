namespace SchoolManagementSystem.Application.DTOs
{
    public class InventoryItemDTO
    {
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public int CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public string Description { get; set; }
        public decimal UnitPrice { get; set; }
        public int TotalQuantity { get; set; }
        public int? ReorderLevel { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
    }
}
