namespace SchoolManagementSystem.Application.DTOs
{
    public class SubjectDTO
    {
        public int? SubjectId { get; set; }
        public string SubjectName { get; set; }
        public string? SubjectDescription { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; } = true;



    }
}
