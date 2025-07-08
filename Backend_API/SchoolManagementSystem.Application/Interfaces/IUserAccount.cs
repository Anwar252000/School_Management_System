using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IUserAccount
    {
        Task<object> AddUser(UserDTO dto);
        Task<UserDTO> ValidUser(LoginDTO dto);

        Task<List<UserDTO>> GetUsersAsync();
        Task UpdateUserAsync(UserDTO dto);
        Task DeleteUserAsync(int userId);

        //Task<UserDTO> GetUserByIdAsync(int userId);

    }
}
