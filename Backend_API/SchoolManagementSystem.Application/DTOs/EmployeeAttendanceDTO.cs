namespace SchoolManagementSystem.Application.DTOs
{
    public class EmployeeAttendanceDTO
    {
        public int EmployeeAttendanceId { get; set; }
        public DateOnly? AttendanceDate { get; set; }

        public string? AttendanceStatus { get; set; }

        public int? EmployeeId { get; set; }

        //public int? CampusId { get; set; }

        public string? CampusName { get; set; }
        public string? EmployeeName { get; set; }
        public int? CreatedBy { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
