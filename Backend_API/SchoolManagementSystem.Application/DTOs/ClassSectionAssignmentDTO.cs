
namespace SchoolManagementSystem.Application.DTOs
{
    public class ClassSectionAssignmentDTO
    {
        public int AssignmentId { get; set; }
        public int? ClassId { get; set; }
        public int? SectionId { get; set; }
        public int? ClassroomId { get; set; }
        public int? CampusId { get; set; }
        public int ClassroomCapacity { get; set; }
        public int ClassCapacity { get; set; }
        public int? SectionCapacity { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; } = true;


    }
}
