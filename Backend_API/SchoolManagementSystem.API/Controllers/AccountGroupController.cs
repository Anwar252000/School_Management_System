using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountGroupController : ControllerBase
    {
        private readonly IAccountGroups _accountGroupService;
        private readonly ILogger<AccountGroupController> _logger;

        public AccountGroupController(ILogger<AccountGroupController> logger, IAccountGroups accountGroup)
        {
            _logger = logger;
            _accountGroupService = accountGroup;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ApiResponse<IEnumerable<AccountGroupDTO>>>> GetAccountGroups()
        {
            _logger.LogInformation("Fetching all AccountGroups.");
            try
            {
                var accountGroups = await _accountGroupService.GetAllAccountGroupsAsync();
                _logger.LogInformation("Successfully retrieved {Count} AccountGroups.", accountGroups?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<AccountGroupDTO>>.SuccessResponse(accountGroups, "AccountGroups retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all AccountGroups.");
                return StatusCode(500, ApiResponse<IEnumerable<AccountGroupDTO>>.ErrorResponse("Internal server error."));
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ApiResponse<IEnumerable<AccountGroupHierarchyDTO>>>> GetAccountHierarchy()
        {
            _logger.LogInformation("Fetching all AccountGroups.");
            try
            {
                var accountGroups = await _accountGroupService.GetAccountHierarchyAsync();
                _logger.LogInformation("Successfully retrieved {Count} AccountGroups.", accountGroups?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<AccountGroupHierarchyDTO>>.SuccessResponse(accountGroups, "AccountGroups retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all AccountGroups.");
                return StatusCode(500, ApiResponse<IEnumerable<AccountGroupHierarchyDTO>>.ErrorResponse("Internal server error."));
            }
        }


        [HttpGet("[action]")]
        public async Task<ActionResult<AccountGroup>> GetAccountGroupById(int id)
        {
            _logger.LogInformation("Fetching AccountGroup with ID {AccountGroupId}.", id);
            try
            {
                var accountGroup = await _accountGroupService.GetAccountGroupByIdAsync(id);
                if (accountGroup == null)
                {
                    _logger.LogWarning("AccountGroup with ID {AccountGroupId} not found.", id);
                    return NotFound();
                }

                _logger.LogInformation("Successfully retrieved AccountGroup with ID {AccountGroupId}.", id);
                return Ok(accountGroup);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching campus with ID {AccountGroupId}.", id);
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<AccountGroupDTO>>> AddAccountGroup([FromBody] AccountGroupDTO dto)
        {
            _logger.LogInformation("Adding a new AccountGroup with name {AccountGroupName}.", dto.AccountGroupName);
            try
            {
                await _accountGroupService.AddAccountGroupAsync(dto);
                _logger.LogInformation("Successfully added accountGroup with ID {AccountGroupId}.", dto.AccountGroupId);
                return Ok(ApiResponse<AccountGroupDTO>.SuccessResponse(dto, "AccountGroup added successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new accountGroup.");
                return StatusCode(500, ApiResponse<AccountGroupDTO>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateAccountGroup([FromBody] AccountGroupDTO dto)
        {
            _logger.LogInformation("Updating AccountGroup with ID {AccountGroupId}.", dto.AccountGroupId);
            try
            {
                await _accountGroupService.UpdateAccountGroupAsync(dto);
                _logger.LogInformation("Successfully updated accountGroup with ID {AccountGroupId}.", dto.AccountGroupId);
                return Ok(ApiResponse<AccountGroupDTO>.SuccessResponse(dto, "AccountGroup updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating AccountGroup with ID {AccountGroupId}.", dto.AccountGroupId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteAccountGroup(int accountGroupId)
        {
            _logger.LogInformation("Deleting AccountGroup with ID {AccountGroupId}.", accountGroupId);
            try
            {
                await _accountGroupService.DeleteAccountGroupAsync(accountGroupId);
                _logger.LogInformation("Successfully deleted AccountGroup with ID {AccountGroupId}.", accountGroupId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "AccountGroup deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting AccountGroup with ID {AccountGroupId}.", accountGroupId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
