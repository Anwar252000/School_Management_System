using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Services;


namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ParentAccountController : ControllerBase
    {
        private readonly IParentAccount _parentAccountService;
        private readonly ILogger<ParentAccountController> _logger;

        public ParentAccountController(ILogger<ParentAccountController> logger, IParentAccount parentAccount)
        {
            _logger = logger;
            _parentAccountService = parentAccount;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<ParentAccountDTO>>> GetAllParentAccounts()
        {
            _logger.LogInformation("Fetching all Parent Accounts.");
            try
            {
                var parentAccounts = await _parentAccountService.GetAllParentAccountsAsync();
                _logger.LogInformation("Successfully retrieved {Count} Parent Accounts.", parentAccounts?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<ParentAccountDTO>>.SuccessResponse(parentAccounts, "ParentAccounts retrieved successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all parentAccounts.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<ParentAccountDTO>>> AddParentAccount([FromBody] ParentAccountDTO dto)
        {
            _logger.LogInformation("Adding a new Parent Account with name {Name}.", dto.ParentAccountName);
            try
            {
                await _parentAccountService.AddParentAccountAsync(dto);
                _logger.LogInformation("Successfully added Parent Account with ID {ParentAccountId}.", dto.ParentAccountId);
                return Ok(ApiResponse<ParentAccountDTO>.SuccessResponse(dto, "Parent Account Added Successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new Parent Account Info.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateParentAccount(ParentAccountDTO dto)
        {

            _logger.LogInformation("Updating Parent Account with ID .", dto.ParentAccountId);
            try
            {
                await _parentAccountService.UpdateParentAccountAsync(dto);
                _logger.LogInformation("Successfully updated Parent Account with ID ParentAccountId.", dto.ParentAccountId);
                return Ok(ApiResponse<ParentAccountDTO>.SuccessResponse(dto, "Parent Account updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating Parent Account with ID {ParentAccountId}.", dto.ParentAccountId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteParentAccount(int parentAccountId)
        {
            _logger.LogInformation("Deleting selection with ID {ParentAccountId}.", parentAccountId);
            try
            {
                await _parentAccountService.DeleteParentAccountAsync(parentAccountId);
                _logger.LogInformation("Successfully deleted Parent Account with ID {ParentAccountId}.", parentAccountId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Section deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting Parent Account with ID {ParentAccountId}.", parentAccountId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
