namespace SchoolManagementSystem.Application.DTOs
{
    public class AcademicYearDTO
    {
        public int AcademicYearId { get; set; }
        public string? AcademicYearName { get; set; }
        public DateTime StartYear { get; set; }
        public DateTime EndYear { get; set; }
        public int? StudentId { get; set; }
        public int? StudentAcademicId { get; set; }
        public int? ExamPaperId { get; set; }
        public int? ExamResultId { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; }

        // You can include navigation properties as well if needed
        public string? CreatedByUserName { get; set; } // If you want to send the user's name or other details
        public string? UpdatedByUserName { get; set; } // If you want to send the user's name or other details
        public string? StudentName { get; set; } // Example: If you want to include the student's name
    }
}
