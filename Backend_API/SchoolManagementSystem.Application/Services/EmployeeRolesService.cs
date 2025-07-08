using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class EmployeeRolesService : IEmployeeRoles
    {
        private readonly IGenericRepository<EmployeeRole> _rolesRepository;
        private readonly RoleMapper _mapper;


        public EmployeeRolesService(IGenericRepository<EmployeeRole> genericRepository, RoleMapper roleMapper)
        {
            _rolesRepository = genericRepository;
            _mapper = roleMapper;
        }

        public async Task AddRolesAsync(RolesDTO role)
        {
            try
            {

                var model = _mapper.MapToEntity(role);
                await _rolesRepository.AddAsync(model);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteRolesAsync(int roleId)
        {
            try
            {
                var roles = await _rolesRepository.GetByIdAsync(roleId);
                if (roles != null)
                {
                    roles.IsActive = false;
                    await _rolesRepository.UpdateAsync(roles);
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<List<RolesDTO>> GetAllRolesAsync()
        {
            try
            {
                var roles = await _rolesRepository.GetAllAsync();
                var activeRoles = roles.Where(c => c.IsActive);

                // Map the entities to DTOs
                var rolesDTO = activeRoles.Select(c => _mapper.MapToDto(c)).ToList();

                return rolesDTO;
            }
            catch (Exception)
            {

                throw;
            }

        }

        public async Task<RolesDTO> GetAllRolesByIdAsync(int roleId)
        {
            throw new NotImplementedException();
        }

        public async Task UpdateRolesAsync(RolesDTO role)
        {
            try
            {
                var model = _mapper.MapToEntity(role);
                await _rolesRepository.UpdateAsync(model);
            }
            catch (Exception)
            {

                throw;
            }

        }
    }
}
