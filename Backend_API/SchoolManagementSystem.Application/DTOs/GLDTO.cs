using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class GLDTO
    {
        public DateTime? EntryDate { get; set; }
        public string? VoucherNo { get; set; }
        public int? AccountId { get; set; }
        public string? AccountCode { get; set; }
        public string? AccountName { get; set; }
        public int? ParentAccountId { get; set; }
        public string? ParentAccountCode { get; set; }
        public string? ParentAccountName { get; set; }
        public int? AccountGroupId { get; set; }
        public string? AccountGroupCode { get; set; }
        public string? AccountGroupName { get; set; }
        public string? Payee { get; set; }
        public string? Description { get; set; }
        public decimal? DebitAmount { get; set; }
        public decimal? CreditAmount { get; set; }
        public decimal? RunningBalance { get; set; }

    }
}
