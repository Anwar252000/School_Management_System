namespace SchoolManagementSystem.Application.DTOs
{
    public class EmployeeDTO
    {
        public int? EmployeeId { get; set; }
        public int? RoleId { get; set; }
        public int? CampusId { get; set; }
        public int? DepartmentId { get; set; }
        public string FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime? HireDate { get; set; } = DateTime.Now;
        public string? Address { get; set; }
        public string? EmergencyContact { get; set; }
        public string Qualifications { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; } = DateTime.Now;
        public int? UpdatedBy { get; set; } = 1;
        public bool IsActive { get; set; } = true;

        //// Additional properties Full objects for related entities
        //public EmployeeRole EmployeeRole { get; set; }
        //public Campus Campus { get; set; }
        ////public Department Departments { get; set; }
        ///

        // Additional properties for related entities
        public string? EmployeeRoleName { get; set; }
        public string? CampusName { get; set; }
        public string? DepartmentName { get; set; }
    }

}
