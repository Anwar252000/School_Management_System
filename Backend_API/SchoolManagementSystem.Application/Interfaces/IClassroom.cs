using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IClassroom
    {
        Task<List<ClassroomDTO>> GetAllClassroomAsync();
        Task<ClassroomDTO> GetClassroomByIdAsync(int classroomId);
        Task AddClassroomAsync(ClassroomDTO clroom);
        Task UpdateClassroomAsync(ClassroomDTO clroom);
        Task DeleteClassroomAsync(int classroomId);

    }
}
