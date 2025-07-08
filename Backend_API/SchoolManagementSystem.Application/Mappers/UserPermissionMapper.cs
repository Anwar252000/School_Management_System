using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class UserPermissionMapper : IMapper<UserPermissionDTO, UserPermission>
    {


        public UserPermission MapToEntity(UserPermissionDTO dto)
        {
            return new UserPermission
            {
                PermissionId = dto.PermissionId,
                RoleId = dto.RoleId,
                UserId = dto.UserId,
                Entity = dto.Entity,
                CanCreate = dto.CanCreate,
                CanUpdate = dto.CanUpdate,
                CanDelete = dto.CanDelete,
                CanRead = dto.CanRead,
                UpdatedBy = dto.UpdatedBy,
                CreatedBy = dto.CreatedBy,

            };
        }
        public UserPermissionDTO MapToDto(UserPermission entity)
        {
            return new UserPermissionDTO
            {
                PermissionId = entity.PermissionId,
                RoleId = entity.RoleId,
                UserId = entity.UserId,
                Entity = entity.Entity,
                CanCreate = entity.CanCreate,
                CanUpdate = entity.CanUpdate,
                CanDelete = entity.CanDelete,
                CanRead = entity.CanRead,
                UserName = entity.Users.UserName,
                RoleName = entity.UserRole.RoleName,
                CreatedBy = entity.CreatedBy,
                UpdatedBy = entity.UpdatedBy,


            };
        }

        public List<UserPermission> MapToEntities(UserPermissionDTO dto)
        {
            var entities = new List<UserPermission>();

            foreach (var entity in dto.Entities)
            {
                entities.Add(new UserPermission
                {
                    PermissionId = dto.PermissionId,
                    RoleId = dto.RoleId,
                    UserId = dto.UserId,
                    Entity = entity,
                    CanCreate = dto.CanCreate,
                    CanUpdate = dto.CanUpdate,
                    CanDelete = dto.CanDelete,
                    CanRead = dto.CanRead,
                    UpdatedBy = dto.UpdatedBy,
                    CreatedBy = dto.CreatedBy,

                });
            }

            return entities;
        }

		public List<UserPermission> MapToEntities(IEnumerable<UserPermissionDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}

