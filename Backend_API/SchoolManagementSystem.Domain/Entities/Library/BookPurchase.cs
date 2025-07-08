using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities.Library
{
    public class BookPurchase
    {
        [Key]
        public int BookPurchaseId { get; set; }

        [ForeignKey("Book")]
        public int? BookId { get; set; }
        public string? PurchasedBy { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public int? Price { get; set; }
        public int? Quantity { get; set; }
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
