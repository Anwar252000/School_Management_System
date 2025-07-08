namespace SchoolManagementSystem.Application.DTOs
{
    public class DailyExpenseDTO
    {
        public int DailyExpenseId { get; set; }
        public string? Item { get; set; }
        public int ExpenseCategoryId { get; set; }
        public string? CategoryName { get; set; }
        public string? Description { get; set; }
        public decimal Amount { get; set; }
        public int Quantity { get; set; }
        public decimal? TotalAmount { get; set; }
        public DateOnly AmountDate { get; set; }
        public string AmountType { get; set; }
        public bool IsActive { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
    }
}
