using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class InventoryStock
    {
        [Key]
        public int StockId { get; set; }
        
        [ForeignKey(nameof(InventoryItems))]
        public int ItemId { get; set; }

        [ForeignKey(nameof(InventoryStatus))]
        public int StatusId { get; set; }
        public int Quantity { get; set; }
        public string TransactionType { get; set; }
        public DateTime TransactionDate { get; set; }
        public string? Remarks { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public InventoryItem? InventoryItems { get; set; }
        public InventoryStatus? InventoryStatus { get; set; }

    }
}
