
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Principal;

namespace SchoolManagementSystem.Domain.Entities
{
    public class ParentAccount
    {
        [Key]
        public int? ParentAccountId { get; set; }

        [ForeignKey("AccountGroup")]
        public int? AccountGroupId { get; set; }
        [Required]
        public string? ParentAccountCode { get; set; }

        public string ParentAccountName { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }

        [Required]
        public bool IsActive { get; set; }

        // Navigation properties
        public AccountGroup? AccountGroup { get; set; }
        public virtual User CreatedUser { get; set; }
        public virtual User UpdatedUser { get; set; }
        public virtual ICollection<Account> ControllingAccounts { get; set; }

    }

}
