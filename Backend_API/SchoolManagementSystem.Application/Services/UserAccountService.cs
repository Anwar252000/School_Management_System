using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class UserAccountService : IUserAccount
    {
        private readonly IGenericRepository<User> _userRepository;
        private readonly UserMapper _mapper;

        public UserAccountService(IGenericRepository<User> genericRepository, UserMapper userMapper)
        {
            _userRepository = genericRepository;
            _mapper = userMapper;
        }
        public async Task<object> AddUser(UserDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            model.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.PasswordHash);
            return await _userRepository.AddAsync(model);
        }

        public async Task DeleteUserAsync(int userId)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);
                if (user != null)
                {
                    user.IsActive = false;
                    await _userRepository.UpdateAsync(user);
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        //public Task<UserDTO> GetUserByIdAsync(int userId)
        //{
        //    throw new NotImplementedException();
        //}

        public async Task<List<UserDTO>> GetUsersAsync()
        {
            var users = await _userRepository.GetAllAsync(
                include: query => query
                .Include(r => r.UserRole)
                .Include(c => c.Campus)
                .Include(p => p.Permissions));
            var activeUsers = users.Where(c => c.IsActive);
            var userDtos = activeUsers.Select(c => _mapper.MapToDto(c)).ToList();
            return userDtos;
        }

        public async Task UpdateUserAsync(UserDTO dto)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(dto.UserId);
                var model = _mapper.MapToEntity(dto);
                model.PasswordHash = user.PasswordHash;
                model.CreatedAt = user.CreatedAt;
                model.UpdatedAt = DateTime.Now;
                await _userRepository.UpdateAsync(model, true);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<UserDTO> ValidUser(LoginDTO dto)
        {
            var users = await _userRepository.GetAllAsync(
                filter: user => user.UserName == dto.UserName,
                include: query => query
                .Include(r => r.UserRole)
                .Include(c => c.Campus)
                .Include(p => p.Permissions));
            //           var users = await _userRepository.FindAllAsync(
            //         x => x.UserName == dto.UserName && x.IsActive,
            //         include: query => query
            //        .Include(r => r.UserRole)
            //        .Include(c => c.Campus)
            //        .Include(p => p.Permissions)
            //);

            //var users = await _userRepository.FindAllAsync(
             //x => x.UserName == dto.UserName && x.IsActive,
               //u => u.UserRole,
                //p => p.Permissions,
                //c => c.Campus
                //);

            var user = users.FirstOrDefault(x => x.Permissions.Any(p => p.IsActive));

            if (user == null)
            {
                return null;
            }


            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            if (!isPasswordValid)
            {
                return null;
            }

            user.Permissions = user.Permissions.Where(p => p.IsActive).ToList();
            return _mapper.MapToDto(user);
        }
    }
}
