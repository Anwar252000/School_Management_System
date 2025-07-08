using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class IStatementDTO
    {
        public string? AccountGroupName { get; set; }
        public string? OtherAccounts { get; set; }
        public string? AccountName { get; set; }
        public DateTime? EntryDate { get; set; }
        public decimal? Amount { get; set; }

    }
}
