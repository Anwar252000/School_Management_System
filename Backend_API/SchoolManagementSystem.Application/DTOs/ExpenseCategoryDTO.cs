namespace SchoolManagementSystem.Application.DTOs
{
    public class ExpenseCategoryDTO
    {
        public int ExpenseCategoryId { get; set; }
        public string CategoryName { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
    }
}
