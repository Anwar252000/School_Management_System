namespace SchoolManagementSystem.Application.DTOs
{
    public class TrainingDTO
    {
        public int TrainingId { get; set; }
        public string? TrainingName { get; set; }
        public int? EmployeeId { get; set; }
        public string? EmployeeName { get; set; }
        public DateTime? TrainingDate { get; set; }
        public string? Certification { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public bool IsActive { get; set; }
    }
}
