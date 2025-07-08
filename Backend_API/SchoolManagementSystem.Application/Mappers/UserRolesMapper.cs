using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class UserRoleMapper : IMapper<UserRolesDTO, UserRole>
    {


        public UserRole MapToEntity(UserRolesDTO dto)
        {
            return new UserRole
            {
                RoleId = dto.RoleId,
                RoleName = dto.RoleName,
                RoleDescription = dto.RoleDescription,
                CreatedBy = dto.CreatedBy,
                UpdatedBy = dto.UpdatedBy,

            };
        }
        public UserRolesDTO MapToDto(UserRole entity)
        {
            return new UserRolesDTO
            {
                RoleId = entity.RoleId,
                RoleName = entity.RoleName,
                RoleDescription = entity.RoleDescription,
                CreatedBy = entity.CreatedBy,
                UpdatedBy = entity.UpdatedBy,


            };
        }

        public List<UserRole> MapToEntities(UserRolesDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<UserRole> MapToEntities(IEnumerable<UserRolesDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
