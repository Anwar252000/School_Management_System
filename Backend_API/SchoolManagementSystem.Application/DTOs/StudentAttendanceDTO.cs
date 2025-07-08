namespace SchoolManagementSystem.Application.DTOs
{
    public class StudentAttendanceDTO
    {
        public int? AttendanceId { get; set; }
        public DateOnly? AttendanceDate { get; set; }

        public string? AttendanceStatus { get; set; }

        public int? StudentId { get; set; }

        //public int? CampusId { get; set; }

        public int? ClassId { get; set; }

        public int? SectionId { get; set; }
        public int? GrNo { get; set; }

        //public string? CampusName { get; set; }
        public string? StudentName { get; set; }
        public string? ClassName { get; set; }
        public string? SectionName { get; set; }
        public int? CreatedBy { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
