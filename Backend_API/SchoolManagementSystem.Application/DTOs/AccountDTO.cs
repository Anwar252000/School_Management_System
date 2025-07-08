namespace SchoolManagementSystem.Domain.Entities
{
    public class AccountDTO
    {
        public int AccountId { get; set; }
        public int? ParentAccountId { get; set; }

        public string? ParentAccountName { get; set; }
        public string AccountCode { get; set; }
        public string AccountName { get; set; }
        public bool IsSubAccount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; } = true;

    }
}
