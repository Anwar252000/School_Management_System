namespace SchoolManagementSystem.Application.DTOs
{
    public class AccountGroupHierarchyDTO
    {
        public int AccountGroupId { get; set; }

        public string AccountGroupName { get; set; }

        public string AccountGroupCode { get; set; }

        public char NormalBalance { get; set; }
        public bool IsActive { get; set; }
        public List<ParentAccountDTO> ParentAccount { get; set; }
    }
}
