




namespace SchoolManagementSystem.Application.DTOs
{
    public class StudentAcademicDTO
    {
        public int StudentAcademicId { get; set; }
        public int StudentId { get; set; }
        public int? CampusId { get; set; }
        public int? ClassId { get; set; }
        public int? SectionId { get; set; }
        public bool IsPromoted { get; set; }
        public string? CampusName { get; set; }
        public string? StudentName { get; set; }
        public string? ClassName { get; set; }
        public string? SectionName { get; set; }
        public DateTime? EnrollmentDate { get; set; }
        public string? AcademicYear { get; set; }
        public DateTime? PromotionDate { get; set; }
        public string? Remarks { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; }
        public bool IsStudied { get; set; }
    }
}
