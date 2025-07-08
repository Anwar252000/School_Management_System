namespace SchoolManagementSystem.Domain.Entities
{
    public class ClassFeeDTO
    {
        public int ClassFeeId { get; set; }
        public int? ClassId { get; set; }
        public int? FeeCategoryId { get; set; }
        public int? CampusId { get; set; }
        public string? CampusName { get; set; }
        public string? ClassName { get; set; }
        public string? FeeName { get; set; }


        public decimal? Amount { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; }
    }
}
