using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class InventoryItem
    {
        [Key]
        public int ItemId { get; set; }
        public string ItemName { get; set; }

        [ForeignKey(nameof(InventoryCategories))]
        public int CategoryId { get; set; }

        public string Description { get; set; }
        public decimal UnitPrice { get; set; }
        public int TotalQuantity { get; set; }
        public int? ReorderLevel { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public InventoryCategory? InventoryCategories { get; set; }

    }
}
