using System.ComponentModel.DataAnnotations;

namespace SchoolManagementSystem.Domain.Entities
{
    public class AccountGroup
    {
        [Key]
        public int AccountGroupId { get; set; }

        public string AccountGroupName { get; set; }

        public string AccountGroupCode { get; set; }

        public char NormalBalance { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<ParentAccount>? ParentAccounts { get; set; }
    }
}
