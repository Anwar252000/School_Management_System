using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IUserPermission
    {
        Task<List<UserPermissionDTO>> GetAllUserPermissionAsync();
        Task AddUserPermissionAsync(UserPermissionDTO dto);
        Task UpdateUserPermissionAsync(UserPermissionDTO dto);
        Task DeleteUserPermissionAsync(int permissionId);

        Task<List<UserPermissionDTO>> GetUserPermissionByUserIdAsync(int userId);
    }
}
