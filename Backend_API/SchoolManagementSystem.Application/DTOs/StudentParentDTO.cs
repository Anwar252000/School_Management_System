namespace SchoolManagementSystem.Application.DTOs
{
    public class StudentParentDTO
    {
        public int StudentParentId { get; set; }
        public int? ParentId { get; set; }
        public int? StudentId { get; set; }
        public string? ParentName { get; set; }
        public string? StudentName { get; set; }
        public int? ApplicantId { get; set; }
        public int? CreatedBy { get; set; }
        public bool IsActive { get; set; }
    }
}
