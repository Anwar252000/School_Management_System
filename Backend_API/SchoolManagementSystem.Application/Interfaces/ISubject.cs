using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface ISubject
    {
        Task<List<SubjectDTO>> GetAllSubjectAsync();
        Task<SubjectDTO> GetSubjectByIdAsync(int subId);
        Task AddSubjectAsync(SubjectDTO sub);
        Task UpdateSubjectAsync(SubjectDTO sub);
        Task DeleteSubjectAsync(int subjectId);

    }
}
