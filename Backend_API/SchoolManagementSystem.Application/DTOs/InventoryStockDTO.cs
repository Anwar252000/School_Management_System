namespace SchoolManagementSystem.Application.DTOs
{
    public class InventoryStockDTO
    {
        public int StockId { get; set; }
        public int ItemId { get; set; }
        public string? ItemName { get; set; }
        public int StatusId { get; set; }
        public string? StatusName { get; set; }
        public int Quantity { get; set; }
        public string TransactionType { get; set; }
        public DateTime TransactionDate { get; set; }
        public string? Remarks { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
    }
}
