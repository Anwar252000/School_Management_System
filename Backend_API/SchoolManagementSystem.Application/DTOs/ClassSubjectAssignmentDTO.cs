
namespace SchoolManagementSystem.Application.DTOs
{
    public class ClassSubjectAssignmentDTO
    {
        public int ClassSubjectId { get; set; }
        public int? ClassId { get; set; }
        public List<int>? SubjectIds { get; set; } = new List<int>();
        public string? SubjectName { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? CreatedBy { get; set; } 
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
