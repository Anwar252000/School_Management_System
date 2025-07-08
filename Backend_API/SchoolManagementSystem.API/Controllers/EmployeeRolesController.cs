using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeRolesController : ControllerBase
    {
        private readonly IEmployeeRoles _roleService;
        private readonly ILogger<EmployeeRolesController> _logger;
        public EmployeeRolesController(ILogger<EmployeeRolesController> logger, IEmployeeRoles role)
        {
            _logger = logger;
            _roleService = role;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<RolesDTO>>> GetRoles()
        {
            _logger.LogInformation("Fetching all roles.");
            try
            {
                var roles = await _roleService.GetAllRolesAsync();
                _logger.LogInformation("Successfully retrieved {Count} roles.", roles?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<RolesDTO>>.SuccessResponse(roles, "roles retrieved successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all roles.");
                return StatusCode(500, ApiResponse<IEnumerable<RolesDTO>>.ErrorResponse("Internal server error."));

            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<RolesDTO>> GetRoleById(int id)
        {
            _logger.LogInformation("Fetching roles with ID {roleId}.", id);
            try
            {
                var roles = await _roleService.GetAllRolesByIdAsync(id);
                if (roles == null)
                {
                    _logger.LogWarning("role with ID {roleId} not found.", id);
                    return NotFound();
                }

                _logger.LogInformation("Successfully retrieved role with ID {roleId}.", id);
                return Ok(roles);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching role with ID {roleId}.", id);
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<RolesDTO>>> AddRole([FromBody] RolesDTO dto)
        {
            _logger.LogInformation("Adding a new role with name {RoleName}.", dto.RoleName);
            try
            {
                await _roleService.AddRolesAsync(dto);
                _logger.LogInformation("Adding a new role with name {RoleName}.", dto.RoleName);
                return Ok(ApiResponse<RolesDTO>.SuccessResponse(dto, "roles Added successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new role.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateRoles(RolesDTO roles)
        {
            _logger.LogInformation("Adding a new role with name {RoleName}.", roles.RoleName);
            try
            {
                await _roleService.UpdateRolesAsync(roles);
                _logger.LogInformation("Adding a new role with name {RoleName}.", roles.RoleName);
                return Ok(ApiResponse<RolesDTO>.SuccessResponse(roles, "roll updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating role with ID {roleId}.", roles.RoleId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteRole(int roleId)
        {

            _logger.LogInformation("Deleting role with ID {roleId}.", roleId);
            try
            {
                await _roleService.DeleteRolesAsync(roleId);
                _logger.LogInformation("Successfully deleted Role with ID {roleId}.", roleId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Role deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting Role with ID {roleId}.", roleId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }

        }


    }
}
