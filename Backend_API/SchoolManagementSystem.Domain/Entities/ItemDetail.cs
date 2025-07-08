using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class ItemDetail
    {
        [Key]
        public int ItemDetailId { get; set; }

        [ForeignKey(nameof(InventoryItems))]
        public int? ItemId { get; set; }

        [ForeignKey(nameof(InventoryStatuses))]
        public int StatusId { get; set; }

        public string? TagNumber { get; set; }
        
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public InventoryItem? InventoryItems { get; set; }
        public InventoryStatus? InventoryStatuses { get; set; }

    }
}
