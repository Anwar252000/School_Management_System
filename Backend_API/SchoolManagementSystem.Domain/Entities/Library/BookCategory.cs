using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities.Library
{
    public class BookCategory
    {
        [Key]
        public int BookCategoryId { get; set; }
        public string CategoryName { get; set; }
        public DateTime? CreatedAt { get; set; }

        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }

        public bool IsActive { get; set; }

        public User? CreatedUser { get; set; }
        public User? UpdatedUser { get; set; }
    }
}
