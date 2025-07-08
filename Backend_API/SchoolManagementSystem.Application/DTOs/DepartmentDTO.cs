using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.DTOs
{
    public class DepartmentDTO
    {
        public int DepartmentId { get; set; }

        public int CampusId { get; set; }

        public string DepartmentName { get; set; }

        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation property
        public Campus? Campus { get; set; }
    }
}
