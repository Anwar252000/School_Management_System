using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class RoleMapper : IMapper<RolesDTO, EmployeeRole>
    {


        public EmployeeRole MapToEntity(RolesDTO dto)
        {
            return new EmployeeRole
            {
                RoleId = dto.RoleId,
                RoleName = dto.RoleName,
                RoleDescription = dto.RoleDescription,
                CreatedBy = dto.CreatedBy,
                UpdatedBy = dto.UpdatedBy,

            };
        }
        public RolesDTO MapToDto(EmployeeRole entity)
        {
            return new RolesDTO
            {
                RoleId = entity.RoleId,
                RoleName = entity.RoleName,
                RoleDescription = entity.RoleDescription,
                CreatedBy = entity.CreatedBy,
                UpdatedBy = entity.UpdatedBy,


            };
        }

        public List<EmployeeRole> MapToEntities(RolesDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<EmployeeRole> MapToEntities(IEnumerable<RolesDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
