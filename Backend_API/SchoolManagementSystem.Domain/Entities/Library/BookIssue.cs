using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities.Library
{
    public class BookIssue
    {
        [Key]
        public int BookIssueId { get; set; }

        [ForeignKey("Book")]
        public int? BookId { get; set; }

        public string? IssuedTo { get; set; }
        public DateTime? IssueDate { get; set; }
        public int? AdvancePayment { get; set; }

        public DateTime? CreatedAt { get; set; }

        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }

        public bool IsActive { get; set; }

        public virtual Book? Book { get; set; }
        public User? CreatedUser { get; set; }
        public User? UpdatedUser { get; set; }
    }
}
