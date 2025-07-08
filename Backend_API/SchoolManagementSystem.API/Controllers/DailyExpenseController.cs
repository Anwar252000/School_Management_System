using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DailyExpenseController : ControllerBase
    {
        private readonly ILogger<DailyExpenseController> _logger;
        private readonly IDailyExpense _dailyExpenseService;

        public DailyExpenseController(ILogger<DailyExpenseController> logger, IDailyExpense dailyExpenseService)
        {
            _logger = logger;
            _dailyExpenseService = dailyExpenseService;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ApiResponse<IEnumerable<DailyExpenseDTO>>>> GetAllDailyExpenses()
        {
            _logger.LogInformation("Fetching all daily expenses.");
            try
            {
                var expenses = await _dailyExpenseService.GetAllDailyExpensesAsync();
                _logger.LogInformation("Successfully retrieved {Count} daily expenses.", expenses?.Count() ?? 0);
                return Ok(ApiResponse<IEnumerable<DailyExpenseDTO>>.SuccessResponse(expenses, "Daily expenses retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all daily expenses.");
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ApiResponse<DailyExpenseDTO>>> GetDailyExpenseById(int dailyExpenseId)
        {
            _logger.LogInformation("Fetching daily expense with ID {dailyExpenseId}.", dailyExpenseId);
            try
            {
                var expense = await _dailyExpenseService.GetDailyExpenseByIdAsync(dailyExpenseId);
                if (expense == null)
                {
                    _logger.LogWarning("Daily expense with ID {dailyExpenseId} not found.", dailyExpenseId);
                    return NotFound(ApiResponse<object>.ErrorResponse("Daily expense not found."));
                }

                _logger.LogInformation("Successfully retrieved daily expense with ID {dailyExpenseId}.", dailyExpenseId);
                return Ok(ApiResponse<DailyExpenseDTO>.SuccessResponse(expense, "Daily expense retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching daily expense with ID {dailyExpenseId}.", dailyExpenseId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<DailyExpenseDTO>>> AddDailyExpense([FromBody] DailyExpenseDTO dto)
        {
            _logger.LogInformation("Adding new daily expense for item {item}.", dto.Item);
            try
            {
                await _dailyExpenseService.AddDailyExpenseAsync(dto);
                _logger.LogInformation("Successfully added daily expense.");
                return Ok(ApiResponse<DailyExpenseDTO>.SuccessResponse(dto, "Daily expense added successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new daily expense.");
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPut("[action]")]
        public async Task<ActionResult<ApiResponse<DailyExpenseDTO>>> UpdateDailyExpense([FromBody] DailyExpenseDTO dto)
        {
            _logger.LogInformation("Updating daily expense with ID {id}.", dto.DailyExpenseId);
            try
            {
                await _dailyExpenseService.UpdateDailyExpenseAsync(dto);
                _logger.LogInformation("Successfully updated daily expense with ID {id}.", dto.DailyExpenseId);
                return Ok(ApiResponse<DailyExpenseDTO>.SuccessResponse(dto, "Daily expense updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating daily expense with ID {id}.", dto.DailyExpenseId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteDailyExpense(int dailyExpenseId)
        {
            _logger.LogInformation("Deleting daily expense with ID {id}.", dailyExpenseId);
            try
            {
                await _dailyExpenseService.DeleteDailyExpenseAsync(dailyExpenseId);
                _logger.LogInformation("Successfully deleted daily expense with ID {id}.", dailyExpenseId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Daily expense deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting daily expense with ID {id}.", dailyExpenseId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
