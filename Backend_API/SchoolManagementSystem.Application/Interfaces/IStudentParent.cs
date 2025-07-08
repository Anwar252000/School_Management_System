using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IStudentParent
    {
        Task<List<StudentParentDTO>> GetAllStudentParentAsync();
        Task AddStudentParentAsync(StudentParentDTO dto);
        Task UpdateStudentParentAsync(StudentParentDTO dto);
        Task DeleteStudentParentAsync(int studentParentId);

        Task<List<StudentParentDTO>> GetStudentsByParentIdAsync(int parentId);

    }
}
