namespace SchoolManagementSystem.Domain.Entities
{
    public class SubjectTeacherAssignmentDTO
    {

        public int SubjectTeacherId { get; set; }
        public int? EmployeeId { get; set; }
        public int? SubjectId { get; set; }
        public string? EmployeeRoleName { get; set; }
        public string? EmployeeName { get; set; }
        public string? SubjectName { get; set; }
        public List<int>? SubjectIds { get; set; } = new List<int>();

        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; } = true;
    }
}