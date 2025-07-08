using SchoolManagementSystem.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace SchoolManagementSystem.Application.DTOs
{
    public class UserDTO
    {
        [Key]
        public int UserId { get; set; }

        public string? UserName { get; set; }

        public string? PasswordHash { get; set; }
        public string? Token { get; set; }

        public int RoleId { get; set; }
        public string? RoleName { get; set; }

        public int CampusId { get; set; }

        public string? CampusName { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public List<UserPermissionDTO>? Permissions { get; set; } = new List<UserPermissionDTO>();

    }
}
