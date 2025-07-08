using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class Account
    {
        [Key]
        public int AccountId { get; set; }

        [ForeignKey("ParentAccount")]
        public int? ParentAccountId { get; set; }
        public string AccountCode { get; set; }
        public string AccountName { get; set; }

        public bool IsSubAccount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; } = true;

        //Navigation Properties
        public virtual ParentAccount ParentAccount { get; set; }
        public virtual User CreatedUser { get; set; }
        public virtual User UpdatedUser { get; set; }
    }
}
