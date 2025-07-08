using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class DailyExpense
    {
        [Key]
        public int DailyExpenseId { get; set; }
        public string? Item { get; set; }

        [ForeignKey("ExpenseCategory")]
        public int ExpenseCategoryId { get; set; }
        public string? Description { get; set; }
        public decimal Amount { get; set; }
        public int Quantity { get; set; }
        public decimal? TotalAmount { get; set; }
        public DateOnly AmountDate { get; set; }
        public string AmountType { get; set; }
        public bool IsActive { get; set; }
        public DateTime? CreatedAt { get; set; }

        [ForeignKey("CreatedUser")]
        public int CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }
        public virtual ExpenseCategory? ExpenseCategory { get; set; }
        public virtual User? CreatedUser { get; set; }
        public virtual User? UpdatedUser { get; set; }
    }
}
