using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface ISubjectTeacherAssignment
    {
        Task<List<SubjectTeacherAssignmentDTO>> GetAllSubjectTeacherAsync();
        //Task<SubjectTeacherAssignmentDTO> GetSubjectTeacherByIdAsync(int subteachId);
        Task AddSubjectTeacherAsync(SubjectTeacherAssignmentDTO subteach);
        Task UpdateSubjectTeacherAsync(SubjectTeacherAssignmentDTO subteach);
        Task DeleteSubjectTeacherAsync(int employeeId);

    }
}
