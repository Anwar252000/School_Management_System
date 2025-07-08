using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IStudent
    {
        Task<List<Student>> GetAllStudentAsync();
        Task<List<StudentDTO>> GetAllStudentsAsync();
        Task<List<StudentDTO>> GetAllStudentClassWiseAsync(int? classId);
        Task<List<StudentDTO>> GetAllStudentByClassAndSectionAsync(int? classId, int? sectionId);

        Task<StudentDTO> GetStudentByIdAsync(int stdId);
        Task AddStudentAsync(Student std);
        Task UpdateStudentAsync(Student std);
        Task DeleteStudentAsync(int stdId);

        Task UpdateStudentDataAsync(StudentDTO std);

    }
}
