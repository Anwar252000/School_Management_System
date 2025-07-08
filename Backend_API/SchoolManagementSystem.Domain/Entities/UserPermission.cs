using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class UserPermission
    {
        [Key]
        public int PermissionId { get; set; }

        [ForeignKey("UserRole")]
        [Required]
        public int? RoleId { get; set; }

        [ForeignKey("Users")]
        [Required]
        public int UserId { get; set; }
        [Required]
        [StringLength(50)]
        public string? Entity { get; set; }

        public bool? CanCreate { get; set; }

        public bool? CanRead { get; set; }

        public bool? CanUpdate { get; set; }

        public bool? CanDelete { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public UserRole? UserRole { get; set; }
        public User? Users { get; set; }
        public User? CreatedUser { get; set; }
        public User? UpdatedUser { get; set; }
    }
}
