using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class UserPermissionService : IUserPermission
    {
        private readonly IGenericRepository<UserPermission> _userPermissionRepository;
        private readonly UserPermissionMapper _mapper;


        public UserPermissionService(IGenericRepository<UserPermission> genericRepository, UserPermissionMapper userPermissionMapper)
        {
            _userPermissionRepository = genericRepository;
            _mapper = userPermissionMapper;
        }

        public async Task AddUserPermissionAsync(UserPermissionDTO dto)

        {
            try
            {
                var entities = _mapper.MapToEntities(dto);

                foreach (var entity in entities)
                {
                    await _userPermissionRepository.AddAsync(entity);
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<List<UserPermissionDTO>> GetAllUserPermissionAsync()
        {
            try
            {
                var userPermissions = await _userPermissionRepository.GetAllAsync(
                     include: query => query
                    .Include(u => u.Users)
                    .Include(r => r.UserRole)
                    );
                var activePermission = userPermissions.Where(c => c.IsActive);


                var permissionDTOs = activePermission.Select(c => _mapper.MapToDto(c)).ToList();

                return permissionDTOs;
            }
            catch (Exception)
            {

                throw;
            }

        }
        public async Task UpdateUserPermissionAsync(UserPermissionDTO dto)
        {
            try
            {
                var model = _mapper.MapToEntity(dto);
                await _userPermissionRepository.UpdateAsync(model);
            }
            catch (Exception)
            {

                throw;
            }

        }
        public async Task DeleteUserPermissionAsync(int permissionId)

        {
            try
            {
                var userPermission = await _userPermissionRepository.GetByIdAsync(permissionId);
                if (userPermission != null)
                {
                    userPermission.IsActive = false;
                    await _userPermissionRepository.UpdateAsync(userPermission);
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<List<UserPermissionDTO>> GetUserPermissionByUserIdAsync(int userId)

        {
            var response = await _userPermissionRepository.GetAllAsync(
                include: query => query
                    .Include(u => u.Users)
                    .Include(r => r.UserRole)
                );
            var filteredResponse = response.Where(x => x.UserId == userId).ToList();
            var responseDTO = filteredResponse.Select(c => _mapper.MapToDto(c)).ToList();
            return responseDTO;

        }


    }


}
