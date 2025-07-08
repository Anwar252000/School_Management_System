using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserPermissionController : ControllerBase
    {
        private readonly IUserPermission _userPermissionService;
        private readonly ILogger<UserPermissionController> _logger;
        public UserPermissionController(ILogger<UserPermissionController> logger, IUserPermission userPermission)
        {
            _logger = logger;
            _userPermissionService = userPermission;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<UserPermissionDTO>>> GetUserPermissions()
        {
            _logger.LogInformation("Fetching all user pernission.");
            try
            {
                var userPermissions = await _userPermissionService.GetAllUserPermissionAsync();
                _logger.LogInformation("Successfully retrieved {Count} user permission.", userPermissions?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<UserPermissionDTO>>.SuccessResponse(userPermissions, "user permissions retrieved successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all user permission.");
                return StatusCode(500, ApiResponse<IEnumerable<UserPermissionDTO>>.ErrorResponse("Internal server error."));

            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<UserPermissionDTO>>> AddUserPermission([FromBody] UserPermissionDTO dto)
        {
            _logger.LogInformation("Adding a new user permission with name {RoleName}.", dto.RoleName);
            try
            {
                await _userPermissionService.AddUserPermissionAsync(dto);
                _logger.LogInformation("Adding a new user permission with name {RoleName}.", dto.RoleName);
                return Ok(ApiResponse<UserPermissionDTO>.SuccessResponse(dto, "user permission Added successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new user permmission.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateUserPermission(UserPermissionDTO dto)
        {
            _logger.LogInformation("Adding a new user permission with name {RoleName}.", dto.RoleName);
            try
            {
                await _userPermissionService.UpdateUserPermissionAsync(dto);
                _logger.LogInformation("Adding a new user permission with name {RoleName}.", dto.RoleName);
                return Ok(ApiResponse<UserPermissionDTO>.SuccessResponse(dto, "user permission Added successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating user role with ID {permissionId}.", dto.PermissionId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteUserPermission(int permissionId)
        {

            _logger.LogInformation("Deleting user Permission with ID {permissionId}.", permissionId);
            try
            {
                await _userPermissionService.DeleteUserPermissionAsync(permissionId);
                _logger.LogInformation("Successfully deleted User Permission with ID {permissionId}.", permissionId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "User Permission deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting User Permission with ID {permissionId}.", permissionId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }

        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ApiResponse<IEnumerable<UserPermissionDTO>>>> GetUserPermissionByUserId(int userId)
        {
            _logger.LogInformation("Fetching permissions for user ID {userId}.", userId);
            try
            {
                var permissions = await _userPermissionService.GetUserPermissionByUserIdAsync(userId);

                if (permissions == null || !permissions.Any())
                {
                    _logger.LogWarning("No permissions found for user ID {userId}.", userId);
                    return NotFound(ApiResponse<object>.ErrorResponse($"No permissions found for user ID {userId}."));
                }

                _logger.LogInformation("Successfully retrieved permissions for user ID {userId}.", userId);
                return Ok(ApiResponse<IEnumerable<UserPermissionDTO>>.SuccessResponse(permissions, "Successfully retrieved data."));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching permissions for user ID {userId}.", userId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }



    }
}
