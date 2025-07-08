using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class DocumentManager
    {
        [Key]
        public int DocumentManagerId { get; set; }
        public string? DocumentTitle { get; set; }
        public string? DocumentType { get; set; }
        public string? FilePath { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;

        // Navigation Properties
        public User? CreatedUser { get; set; }
        public User? UpdatedUser { get; set; }

    }
}
