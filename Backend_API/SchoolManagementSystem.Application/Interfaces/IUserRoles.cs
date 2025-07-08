using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IUserRoles
    {
        Task<List<UserRolesDTO>> GetAllUserRolesAsync();
        Task AddUserRolesAsync(UserRolesDTO dto);
        Task UpdateUserRolesAsync(UserRolesDTO dto);
        Task DeleteUserRolesAsync(int roleId);

        Task<UserRolesDTO> GetUserRolesByIdAsync(int roleId);
    }
}
