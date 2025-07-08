using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class AssetAllocation
    {
        [Key]
        public int AllocationId { get; set; }

        [ForeignKey(nameof(InventoryItems))]
        public int ItemId { get; set; }

        public string AllocatedTo { get; set; }

        [ForeignKey(nameof(Users))]
        public int AllocatedBy { get; set; }

        public int Quantity { get; set; }
        public DateOnly AllocationDate { get; set; }
        public string AllocatedLocation { get; set; }

        [ForeignKey(nameof(InventoryStatuses))]
        public int StatusId { get; set; }
        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        public int CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public int? UpdatedBy { get; set; }

        public InventoryItem? InventoryItems { get; set; }
        public User? Users { get; set; }
        public InventoryStatus? InventoryStatuses { get; set; }

    }
}
