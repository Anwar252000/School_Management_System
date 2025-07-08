using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IClassSectionAssignment
    {
        Task<List<ClassSectionAssignmentDTO>> GetAllClassesAssignmentAsync();
        Task<ClassSectionAssignment> GetClassSectionAssignmentByIdAsync(int classroomId);
        Task AddClassSectionAssignmentAsync(ClassSectionAssignmentDTO classroom);
        Task UpdateClassSectionAssignmentAsync(ClassSectionAssignmentDTO classroom);
        Task DeleteClassSectionAssignmentAsync(int assignmentId);

    }
}
