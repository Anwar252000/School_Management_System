
namespace SchoolManagementSystem.Application.DTOs
{
    public class InventoryPurchaseDTO
    {
        public int PurchaseId { get; set; }

        public int ItemId { get; set; }

        public string? ItemName { get; set; }
        public string SupplierName { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal? TotalCost { get; internal set; }

        public DateTime? PurchaseDate { get; set; }

        public string InvoiceNumber { get; set; }

        public string Remarks { get; set; }
        public DateTime CreatedAt { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public int? UpdatedBy { get; set; }

        public bool IsActive { get; set; }

    }
}
