using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IClassSubject
    {
        Task<List<ClassSubjectAssignmentDTO>> GetAllClassSubjectAsync();
        Task<ClassSubject> GetClassSubjectByIdAsync(int classsubjectId);
        Task AddClassSubjectAsync(ClassSubjectAssignmentDTO classsubject);
        Task UpdateClassSubjectAsync(ClassSubjectAssignmentDTO classsubject);
        Task DeleteClassSubjectAsync(int classsubjectId);

    }
}
