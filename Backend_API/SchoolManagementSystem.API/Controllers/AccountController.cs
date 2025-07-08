using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IAccount _accountService;
        private readonly ILogger<AccountController> _logger;

        public AccountController(ILogger<AccountController> logger, IAccount account)
        {
            _logger = logger;
            _accountService = account;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ApiResponse<IEnumerable<AccountDTO>>>> GetAllAccounts()
        {
            _logger.LogInformation("Fetching all Accounts.");
            try
            {
                var accounts = await _accountService.GetAllAccountsAsync();
                _logger.LogInformation("Successfully retrieved {Count} Accounts.", accounts?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<AccountDTO>>.SuccessResponse(accounts, "Accounts retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all Accounts.");
                return StatusCode(500, ApiResponse<IEnumerable<AccountDTO>>.ErrorResponse("Internal server error."));
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<Account>> GetAccountById(int id)
        {
            _logger.LogInformation("Fetching Account with ID {AccountId}.", id);
            try
            {
                var account = await _accountService.GetAccountByIdAsync(id);
                if (account == null)
                {
                    _logger.LogWarning("Account with ID {AccountId} not found.", id);
                    return NotFound();
                }

                _logger.LogInformation("Successfully retrieved Account with ID {AccountId}.", id);
                return Ok(account);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching Account with ID {AccountId}.", id);
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<AccountDTO>>> AddAccount([FromBody] AccountDTO dto)
        {
            _logger.LogInformation("Adding a new Account with name {AccountName}.", dto.AccountName);
            try
            {
                await _accountService.AddAccountAsync(dto);
                _logger.LogInformation("Successfully added account with ID {AccountId}.", dto.AccountId);
                return Ok(ApiResponse<AccountDTO>.SuccessResponse(dto, "Account added successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new account.");
                return StatusCode(500, ApiResponse<AccountDTO>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateAccount([FromBody] AccountDTO dto)
        {
            _logger.LogInformation("Updating Account with ID {AccountId}.", dto.AccountId);
            try
            {
                await _accountService.UpdateAccountAsync(dto);
                _logger.LogInformation("Successfully updated account with ID {AccountId}.", dto.AccountId);
                return Ok(ApiResponse<AccountDTO>.SuccessResponse(dto, "Account updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating Account with ID {AccountId}.", dto.AccountId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteAccount(int accountId)
        {
            _logger.LogInformation("Deleting Account with ID {AccountId}.", accountId);
            try
            {
                await _accountService.DeleteAccountAsync(accountId);
                _logger.LogInformation("Successfully deleted Account with ID {AccountId}.", accountId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Account deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting Account with ID {AccountId}.", accountId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
