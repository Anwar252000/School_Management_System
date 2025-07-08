
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.DTOs
{
    public class ParentAccountDTO
    {
        public int? ParentAccountId { get; set; }
        public int? AccountGroupId { get; set; }
        public string? ParentAccountCode { get; set; }
        public string? ParentAccountName { get; set; }
        public string? AccountGroupName { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; } = true;
        public List<AccountDTO>? ControllingAccount { get; set; }

    }
}
