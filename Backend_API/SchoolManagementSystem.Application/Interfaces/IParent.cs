using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IParent
    {
        Task<List<ParentDTO>> GetAllParentAsync();
        Task AddParentAsync(ParentDTO dto);
        Task UpdateParentAsync(ParentDTO dto);
        Task DeleteParentAsync(int parentId);

    }
}
