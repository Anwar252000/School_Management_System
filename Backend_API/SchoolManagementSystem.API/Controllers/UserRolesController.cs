using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRolesController : ControllerBase
    {
        private readonly IUserRoles _userRoleService;
        private readonly ILogger<UserRolesController> _logger;
        public UserRolesController(ILogger<UserRolesController> logger, IUserRoles userRole)
        {
            _logger = logger;
            _userRoleService = userRole;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<UserRolesDTO>>> GetUserRoles()
        {
            _logger.LogInformation("Fetching all user roles.");
            try
            {
                var userRoles = await _userRoleService.GetAllUserRolesAsync();
                _logger.LogInformation("Successfully retrieved {Count} user roles.", userRoles?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<UserRolesDTO>>.SuccessResponse(userRoles, "user roles retrieved successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all user roles.");
                return StatusCode(500, ApiResponse<IEnumerable<UserRolesDTO>>.ErrorResponse("Internal server error."));

            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<UserRolesDTO>>> AddUserRole([FromBody] UserRolesDTO dto)
        {
            _logger.LogInformation("Adding a new user role with name {RoleName}.", dto.RoleName);
            try
            {
                await _userRoleService.AddUserRolesAsync(dto);
                _logger.LogInformation("Adding a new user role with name {RoleName}.", dto.RoleName);
                return Ok(ApiResponse<UserRolesDTO>.SuccessResponse(dto, "user roles Added successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new user role.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateUserRoles(UserRolesDTO dto)
        {
            _logger.LogInformation("Adding a new user role with name {RoleName}.", dto.RoleName);
            try
            {
                await _userRoleService.UpdateUserRolesAsync(dto);
                _logger.LogInformation("Adding a new user role with name {RoleName}.", dto.RoleName);
                return Ok(ApiResponse<UserRolesDTO>.SuccessResponse(dto, "user roles Added successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating user role with ID {roleId}.", dto.RoleId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteUserRole(int roleId)
        {

            _logger.LogInformation("Deleting user role with ID {roleId}.", roleId);
            try
            {
                await _userRoleService.DeleteUserRolesAsync(roleId);
                _logger.LogInformation("Successfully deleted User Role with ID {roleId}.", roleId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "User Role deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting User Role with ID {roleId}.", roleId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserRolesDTO>> GetUserRoleById(int id)
        {
            _logger.LogInformation("Fetching roles with ID {roleId}.", id);
            try
            {
                var roles = await _userRoleService.GetUserRolesByIdAsync(id);
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


    }
}
