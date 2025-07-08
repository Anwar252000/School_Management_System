using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpenseCategoryController : ControllerBase
    {
        private readonly ILogger<ExpenseCategoryController> _logger;
        private readonly IExpenseCategory _expenseCategoryService;

        public ExpenseCategoryController(ILogger<ExpenseCategoryController> logger, IExpenseCategory expenseCategoryService)
        {
            _logger = logger;
            _expenseCategoryService = expenseCategoryService;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ApiResponse<IEnumerable<ExpenseCategoryDTO>>>> GetAllExpenseCategories()
        {
            _logger.LogInformation("Fetching all expense categories.");
            try
            {
                var categories = await _expenseCategoryService.GetAllExpenseCategoriesAsync();
                _logger.LogInformation("Successfully retrieved {Count} expense categories.", categories?.Count() ?? 0);
                return Ok(ApiResponse<IEnumerable<ExpenseCategoryDTO>>.SuccessResponse(categories, "Expense categories retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all expense categories.");
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ApiResponse<ExpenseCategoryDTO>>> GetExpenseCategoryById(int expenseCategoryId)
        {
            _logger.LogInformation("Fetching expense category with ID {Id}.", expenseCategoryId);
            try
            {
                var category = await _expenseCategoryService.GetExpenseCategoryByIdAsync(expenseCategoryId);
                if (category == null)
                {
                    _logger.LogWarning("Expense category with ID {Id} not found.", expenseCategoryId);
                    return NotFound(ApiResponse<object>.ErrorResponse("Expense category not found."));
                }

                _logger.LogInformation("Successfully retrieved expense category with ID {Id}.", expenseCategoryId);
                return Ok(ApiResponse<ExpenseCategoryDTO>.SuccessResponse(category, "Expense category retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching expense category with ID {Id}.", expenseCategoryId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<ExpenseCategoryDTO>>> AddExpenseCategory([FromBody] ExpenseCategoryDTO dto)
        {
            _logger.LogInformation("Adding new expense category: {Name}.", dto.CategoryName);
            try
            {
                await _expenseCategoryService.AddExpenseCategoryAsync(dto);
                _logger.LogInformation("Successfully added expense category.");
                return Ok(ApiResponse<ExpenseCategoryDTO>.SuccessResponse(dto, "Expense category added successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new expense category.");
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPut("[action]")]
        public async Task<ActionResult<ApiResponse<ExpenseCategoryDTO>>> UpdateExpenseCategory([FromBody] ExpenseCategoryDTO dto)
        {
            _logger.LogInformation("Updating expense category with ID {Id}.", dto.ExpenseCategoryId);
            try
            {
                await _expenseCategoryService.UpdateExpenseCategoryAsync(dto);
                _logger.LogInformation("Successfully updated expense category with ID {Id}.", dto.ExpenseCategoryId);
                return Ok(ApiResponse<ExpenseCategoryDTO>.SuccessResponse(dto, "Expense category updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating expense category with ID {Id}.", dto.ExpenseCategoryId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteExpenseCategory(int expenseCategoryId)
        {
            _logger.LogInformation("Deleting expense category with ID {Id}.", expenseCategoryId);
            try
            {
                await _expenseCategoryService.DeleteExpenseCategoryAsync(expenseCategoryId);
                _logger.LogInformation("Successfully deleted expense category with ID {Id}.", expenseCategoryId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Expense category deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting expense category with ID {Id}.", expenseCategoryId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
