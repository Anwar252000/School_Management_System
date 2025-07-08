using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class UserMapper : IMapper<UserDTO, User>
    {
        public UserDTO MapToDto(User entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            return new UserDTO
            {
                RoleId = entity.RoleId,
                CampusId = entity.CampusId,
                UserName = entity.UserName,
                //PasswordHash = entity.PasswordHash,
                IsActive = entity.IsActive,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt,
                UserId = entity.UserId,
                RoleName = entity?.UserRole?.RoleName,
                CampusName = entity.Campus?.CampusName,
                Permissions = entity?.Permissions?.Select(per => new UserPermissionDTO
                {
                    PermissionId = per.PermissionId,
                    Entity = per.Entity,
                    UserId = per.UserId,
                    IsActive = per.IsActive,
                    CreatedBy = per.CreatedBy,
                    CreatedAt = per.CreatedAt
                }).ToList()
            };
        }

        public List<User> MapToEntities(UserDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<User> MapToEntities(IEnumerable<UserDTO> dto)
		{
			throw new NotImplementedException();
		}

		public User MapToEntity(UserDTO dto)
        {
            if (dto == null)
            {
                throw new ArgumentNullException(nameof(dto));
            }

            return new User
            {
                UserId = dto.UserId,
                UserName = dto.UserName,
                PasswordHash = dto.PasswordHash,
                IsActive = dto.IsActive,
                CampusId = dto.CampusId,
                RoleId = dto.RoleId,
                CreatedAt = dto.CreatedAt,
                UpdatedAt = dto.UpdatedAt
            };
        }
    }
}
