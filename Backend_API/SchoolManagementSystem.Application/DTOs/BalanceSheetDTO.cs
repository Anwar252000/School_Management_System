using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class BalanceSheetDTO
    {
        public int? AccountId { get; set; }
        public string? GroupName { get; set; }
        public string? AccountCode { get; set; }
        public string? AccountName { get; set; }
        public DateTime? EntryDate { get; set; }
        public decimal? Balance { get; set; }

    }
}
