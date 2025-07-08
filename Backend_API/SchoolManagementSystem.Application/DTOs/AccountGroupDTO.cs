using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Domain.Entities
{
    public class AccountGroupDTO
    {
        public int AccountGroupId { get; set; }

        public string AccountGroupName { get; set; }

        public string AccountGroupCode { get; set; }

        public char NormalBalance { get; set; }
        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
        public ICollection<ParentAccountDTO>? ParentAccounts { get; set; }
    }
}
