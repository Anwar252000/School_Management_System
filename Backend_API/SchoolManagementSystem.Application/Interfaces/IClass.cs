using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IClass
    {
        Task<List<ClassDto>> GetAllClassAsync();
        Task<ClassDto> GetClassByIdAsync(int classId);
        Task AddClassAsync(ClassDto classes);
        Task UpdateClassAsync(ClassDto classes);
        Task DeleteClassAsync(int classId);

    }
}
