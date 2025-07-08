using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IEmployeeRoles
    {
        Task<List<RolesDTO>> GetAllRolesAsync();
        Task<RolesDTO> GetAllRolesByIdAsync(int roleId);
        Task AddRolesAsync(RolesDTO role);
        Task UpdateRolesAsync(RolesDTO role);
        Task DeleteRolesAsync(int roleId);

    }
}
