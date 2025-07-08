namespace SchoolManagementSystem.Application.DTOs
{
    public class ParentDTO
    {
        public int? ParentId { get; set; }
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? MotherTongue { get; set; }
        //public string? State { get; set; }
        public string? Nationality { get; set; }
        public string? SourceOfIncome { get; set; }
        public string? Occupation { get; set; }
        public string? ResidenceStatus { get; set; }
        public string? ParentAddress { get; set; }
        public string? Dependent { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }


    }
}
