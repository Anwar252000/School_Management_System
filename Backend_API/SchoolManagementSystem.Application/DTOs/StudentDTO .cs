namespace SchoolManagementSystem.Application.DTOs
{
    public class StudentDTO
    {
        public int StudentId { get; set; }
        public int? GrNo { get; set; }

        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        public string? Gender { get; set; }
        public string? ClassName { get; set; }

        public string? SectionName { get; set; }

        public DateOnly? DateOfBirth { get; set; }
        public DateTime? EnrollmentDate { get; set; }
        public string? ProfileImage { get; set; }
        public int? ClassId { get; set; }
        public int? SectionId { get; set; }

        public int? CampusId { get; set; }
        public string? CampusName { get; set; }

        public bool IsActive { get; set; } = true;

    }
}
