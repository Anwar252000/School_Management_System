using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Domain.Entities
{
    public class TransactionDTO
    {
        public int TransactionId { get; set; }
        public int VoucherTypeId { get; set; }
        public string? VoucherType { get; set; }
        public string VoucherNo { get; set; }
        public string Payee { get; set; }
        public string? Messer { get; set; }
        public DateTime EntryDate { get; set; }
        public string? Status { get; set; }

        public ICollection<TransactionDetailDTO>? TransactionDetail { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public int? UpdatedBy { get; set; }

        public bool IsActive { get; set; }
    }
}
