namespace SchoolManagementSystem.Application.DTOs
{
    public class AssetAllocationDTO
    {
        public int AllocationId { get; set; }

        public int ItemId { get; set; }
        public string? ItemName { get; set; }

        public string AllocatedTo { get; set; }

        public int Quantity { get; set; }
        public int AllocatedBy { get; set; }
        public string? AllocatedByName { get; set; }

        public DateOnly AllocationDate { get; set; }
        public string AllocatedLocation { get; set; }

        public int StatusId { get; set; }
        public string? StatusName { get; set; }
        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        public int CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public int? UpdatedBy { get; set; }
    }
}
