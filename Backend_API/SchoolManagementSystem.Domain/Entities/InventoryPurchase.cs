using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class InventoryPurchase
    {
        [Key]
        public int PurchaseId { get; set; }

        [ForeignKey(nameof(InventoryItems))]

        public int ItemId { get; set; }
        public string SupplierName { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public decimal? TotalCost { get; set; }

        public DateTime? PurchaseDate { get; set; }

        public string InvoiceNumber { get; set; }

        public string Remarks { get; set; }
        public DateTime CreatedAt { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public int? UpdatedBy { get; set; }

        public bool IsActive { get; set; }

        public InventoryItem? InventoryItems { get; set; }

    }
}
