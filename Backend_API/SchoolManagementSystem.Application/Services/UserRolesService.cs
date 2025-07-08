using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class UserRolesService : IUserRoles
    {
        private readonly IGenericRepository<UserRole> _userRoleRepository;
        private readonly UserRoleMapper _mapper;


        public UserRolesService(IGenericRepository<UserRole> genericRepository, UserRoleMapper userRoleMapper)
        {
            _userRoleRepository = genericRepository;
            _mapper = userRoleMapper;
        }

        public async Task AddUserRolesAsync(UserRolesDTO dto)
        {
            try
            {

                var model = _mapper.MapToEntity(dto);
                await _userRoleRepository.AddAsync(model);
            }
            catch (Exception)
            {

                throw;
            }
        }
        public async Task<List<UserRolesDTO>> GetAllUserRolesAsync()
        {
            try
            {
                var userRole = await _userRoleRepository.GetAllAsync();
                var activeRoles = userRole.Where(c => c.IsActive);


                var roleDTO = activeRoles.Select(c => _mapper.MapToDto(c)).ToList();

                return roleDTO;
            }
            catch (Exception)
            {

                throw;
            }

        }
        public async Task UpdateUserRolesAsync(UserRolesDTO dto)
        {
            try
            {
                var model = _mapper.MapToEntity(dto);
                await _userRoleRepository.UpdateAsync(model);
            }
            catch (Exception)
            {

                throw;
            }

        }
        public async Task DeleteUserRolesAsync(int roleId)
        {
            try
            {
                var userRole = await _userRoleRepository.GetByIdAsync(roleId);
                if (userRole != null)
                {
                    userRole.IsActive = false;
                    await _userRoleRepository.UpdateAsync(userRole);
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<UserRolesDTO> GetUserRolesByIdAsync(int roleId)
        {
            var response = await _userRoleRepository.GetByIdAsync(roleId);
            return _mapper.MapToDto(response);
        }
    }
}
