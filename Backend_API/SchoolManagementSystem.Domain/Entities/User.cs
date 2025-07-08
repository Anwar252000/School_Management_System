using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        [StringLength(50)]
        public string UserName { get; set; }

        [Required]
        [StringLength(255)]
        public string PasswordHash { get; set; }

        [ForeignKey("UserRole")]
        public int RoleId { get; set; }

        [ForeignKey("Campus")]
        public int CampusId { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;

        [Required]
        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public UserRole? UserRole { get; set; }
        public Campus? Campus { get; set; }

        public ICollection<UserPermission>? Permissions { get; set; }
    }
}
