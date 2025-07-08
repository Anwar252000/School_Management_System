using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController : ControllerBase
    {
        private readonly ITransaction _transactionService;
        private readonly ILogger<TransactionController> _logger;

        public TransactionController(ILogger<TransactionController> logger, ITransaction transaction)
        {
            _logger = logger;
            _transactionService = transaction;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ApiResponse<IEnumerable<TransactionDTO>>>> GetAllTransactions()
        {
            _logger.LogInformation("Fetching all Transactions.");
            try
            {
                var transactions = await _transactionService.GetAllTransactionsAsync();
                _logger.LogInformation("Successfully retrieved {Count} Transactions.", transactions?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<TransactionDTO>>.SuccessResponse(transactions, "Transactions retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all Transactions.");
                return StatusCode(500, ApiResponse<IEnumerable<TransactionDTO>>.ErrorResponse("Internal server error."));
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<Transaction>> GetTransactionById(int id)
        {
            _logger.LogInformation("Fetching Transaction with ID {TransactionId}.", id);
            try
            {
                var transaction = await _transactionService.GetTransactionByIdAsync(id);
                if (transaction == null)
                {
                    _logger.LogWarning("Transaction with ID {TransactionId} not found.", id);
                    return NotFound();
                }

                _logger.LogInformation("Successfully retrieved Transaction with ID {TransactionId}.", id);
                return Ok(transaction);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching Transaction with ID {TransactionId}.", id);
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<TransactionDTO>>> AddTransaction([FromBody] TransactionDTO dto)
        {
            _logger.LogInformation("Adding a new Transaction with name {TransactionName}.", dto.Payee);
            try
            {
                await _transactionService.AddTransactionAsync(dto);
                _logger.LogInformation("Successfully added transaction with ID {TransactionId}.", dto.TransactionId);
                return Ok(ApiResponse<TransactionDTO>.SuccessResponse(dto, "Transaction added successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new transaction.");
                return StatusCode(500, ApiResponse<TransactionDTO>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateTransaction([FromBody] TransactionDTO dto)
        {
            _logger.LogInformation("Updating Transaction with ID {TransactionId}.", dto.TransactionId);
            try
            {
                await _transactionService.UpdateTransactionAsync(dto);
                _logger.LogInformation("Successfully updated transaction with ID {TransactionId}.", dto.TransactionId);
                return Ok(ApiResponse<TransactionDTO>.SuccessResponse(dto, "Transaction updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating Transaction with ID {TransactionId}.", dto.TransactionId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteTransaction(int transactionId)
        {
            _logger.LogInformation("Deleting Transaction with ID {TransactionId}.", transactionId);
            try
            {
                await _transactionService.DeleteTransactionAsync(transactionId);
                _logger.LogInformation("Successfully deleted Transaction with ID {TransactionId}.", transactionId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Transaction deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting Transaction with ID {TransactionId}.", transactionId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
