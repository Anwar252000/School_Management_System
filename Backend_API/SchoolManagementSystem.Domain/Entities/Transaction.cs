using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class Transaction
    {
        [Key]
        public int TransactionId { get; set; }
        
        [ForeignKey("VoucherTypes")]
        public int VoucherTypeId { get; set; }
        public string VoucherNo { get; set; }
        public string Payee { get; set; }
        public string? Messer { get; set; }
        public DateTime EntryDate { get; set; }
        public string? Status { get; set; }

        public DateTime? CreatedAt { get; set; }

        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }

        public bool IsActive { get; set; }

        public User? CreatedUser { get; set; }
        public User? UpdatedUser { get; set; }

        public VoucherTypes? VoucherTypes { get; set; }
        public virtual ICollection<TransactionDetail>? TransactionDetail { get; set; }
    }
}
