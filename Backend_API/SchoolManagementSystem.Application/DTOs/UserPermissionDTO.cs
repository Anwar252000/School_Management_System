namespace SchoolManagementSystem.Domain.Entities
{
    public class UserPermissionDTO
    {

        public int PermissionId { get; set; }
        public int? RoleId { get; set; }
        public string? RoleName { get; set; }
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public string? Entity { get; set; }
        public List<string>? Entities { get; set; } = new List<string>();
        public bool? CanCreate { get; set; }
        public bool? CanRead { get; set; }
        public bool? CanUpdate { get; set; }
        public bool? CanDelete { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; } = true;
    }
}