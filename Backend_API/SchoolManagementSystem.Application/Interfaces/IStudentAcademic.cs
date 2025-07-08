using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IStudentAcademic
    {
        Task<List<StudentAcademicDTO>> GetAllStudentAcademicAsync();
        Task<StudentAcademicDTO> GetStudentAcademicByIdAsync(int id);
        Task AddStudentAcademicAsync(StudentAcademicDTO dto);
        Task PromoteStudentAcademicAsync(StudentAcademicDTO dto);
        Task<StudentAcademicDTO> GetByStudentIdAsync(int studentId);
        Task<List<StudentAcademicDTO>> GetPromotedStudentByClass(int classId, string? date);
        Task UpdateStudentAcademicAsync(StudentAcademicDTO dto);
        Task DeleteStudentAcademicAsync(int id);
    }
}
