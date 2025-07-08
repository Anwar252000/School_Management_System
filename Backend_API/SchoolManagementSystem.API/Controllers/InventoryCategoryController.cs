using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Services;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryCategoryController : ControllerBase
    {
        private readonly IInventoryCategories _inventoryCategoryService;
        private readonly ILogger<InventoryCategoryController> _logger;

        public InventoryCategoryController(ILogger<InventoryCategoryController> logger, IInventoryCategories inventoryCategory)
        {
            _logger = logger;
            _inventoryCategoryService = inventoryCategory;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ApiResponse<IEnumerable<InventoryCategoryDTO>>>> GetInventoryCategories()
        {
            _logger.LogInformation("Fetching all InventoryCategories.");
            try
            {
                var inventoryCategories = await _inventoryCategoryService.GetAllInventoryCategoriesAsync();
                _logger.LogInformation("Successfully retrieved {Count} InventoryCategories.", inventoryCategories?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<InventoryCategoryDTO>>.SuccessResponse(inventoryCategories, "InventoryCategories retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all InventoryCategories.");
                return StatusCode(500, ApiResponse<IEnumerable<InventoryCategoryDTO>>.ErrorResponse("Internal server error."));
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<InventoryCategory>> GetInventoryCategoryById(int id)
        {
            _logger.LogInformation("Fetching InventoryCategory with ID {InventoryCategoryId}.", id);
            try
            {
                var inventoryCategory = await _inventoryCategoryService.GetInventoryCategoryByIdAsync(id);
                if (inventoryCategory == null)
                {
                    _logger.LogWarning("InventoryCategory with ID {InventoryCategoryId} not found.", id);
                    return NotFound();
                }

                _logger.LogInformation("Successfully retrieved InventoryCategory with ID {InventoryCategoryId}.", id);
                return Ok(inventoryCategory);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching campus with ID {InventoryCategoryId}.", id);
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<InventoryCategoryDTO>>> AddInventoryCategory([FromBody] InventoryCategoryDTO dto)
        {
            _logger.LogInformation("Adding a new InventoryCategory with name {InventoryCategoryName}.", dto.CategoryName);
            try
            {
                await _inventoryCategoryService.AddInventoryCategoryAsync(dto);
                _logger.LogInformation("Successfully added inventoryCategory with ID {InventoryCategoryId}.", dto.CategoryId);
                return Ok(ApiResponse<InventoryCategoryDTO>.SuccessResponse(dto, "InventoryCategory added successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new inventoryCategory.");
                return StatusCode(500, ApiResponse<InventoryCategoryDTO>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateInventoryCategory([FromBody] InventoryCategoryDTO dto)
        {
            _logger.LogInformation("Updating InventoryCategory with ID {InventoryCategoryId}.", dto.CategoryId);
            try
            {
                await _inventoryCategoryService.UpdateInventoryCategoryAsync(dto);
                _logger.LogInformation("Successfully updated inventoryCategory with ID {CategoryId}.", dto.CategoryId);
                return Ok(ApiResponse<InventoryCategoryDTO>.SuccessResponse(dto, "InventoryCategory updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating InventoryCategory with ID {InventoryCategoryId}.", dto.CategoryId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteInventoryCategory(int inventoryCategoryId)
        {
            _logger.LogInformation("Deleting InventoryCategory with ID {InventoryCategoryId}.", inventoryCategoryId);
            try
            {
                await _inventoryCategoryService.DeleteInventoryCategoryAsync(inventoryCategoryId);
                _logger.LogInformation("Successfully deleted InventoryCategory with ID {InventoryCategoryId}.", inventoryCategoryId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "InventoryCategory deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting InventoryCategory with ID {InventoryCategoryId}.", inventoryCategoryId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
