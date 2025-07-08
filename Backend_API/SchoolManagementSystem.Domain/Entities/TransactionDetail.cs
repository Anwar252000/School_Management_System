using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class TransactionDetail
    {
        [Key]
        public int? TransactionDetailId { get; set; }

        [ForeignKey("Transaction")]
        public int? TransactionId { get; set; }
        public int? AccountId { get; set; }
        public string? Description { get; set; }
        public decimal? DebitAmount { get; set; }
        public decimal? CreditAmount { get; set; }

        public DateTime? CreatedAt { get; set; }
        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public int? UpdatedBy { get; set; }

        public bool? IsActive { get; set; }

        public Transaction? Transaction { get; set; }
    }
}
