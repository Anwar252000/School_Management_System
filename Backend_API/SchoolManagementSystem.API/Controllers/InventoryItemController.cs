using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryItemController : ControllerBase
    {
        private readonly IInventoryItems _inventoryItemService;
        private readonly ILogger<InventoryItemController> _logger;

        public InventoryItemController(ILogger<InventoryItemController> logger, IInventoryItems inventoryItem)
        {
            _logger = logger;
            _inventoryItemService = inventoryItem;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ApiResponse<IEnumerable<InventoryItemDTO>>>> GetInventoryItems()
        {
            _logger.LogInformation("Fetching all InventoryItems.");
            try
            {
                var inventoryItems = await _inventoryItemService.GetAllInventoryItemsAsync();
                _logger.LogInformation("Successfully retrieved {Count} InventoryItems.", inventoryItems?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<InventoryItemDTO>>.SuccessResponse(inventoryItems, "InventoryItems retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all InventoryItems.");
                return StatusCode(500, ApiResponse<IEnumerable<InventoryItemDTO>>.ErrorResponse("Internal server error."));
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ApiResponse<IEnumerable<ItemDetailDTO>>>> GetItemDetailsByItemId(int itemId)
        {
            _logger.LogInformation("Fetching all InventoryItems.");
            try
            {
                var inventoryItems = await _inventoryItemService.GetItemDetailsByItemIdAsync(itemId);
                _logger.LogInformation("Successfully retrieved {Count} InventoryItems.", inventoryItems?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<ItemDetailDTO>>.SuccessResponse(inventoryItems, "InventoryItems retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all InventoryItems.");
                return StatusCode(500, ApiResponse<IEnumerable<ItemDetailDTO>>.ErrorResponse("Internal server error."));
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<InventoryItem>> GetInventoryItemById(int id)
        {
            _logger.LogInformation("Fetching InventoryItem with ID {InventoryItemId}.", id);
            try
            {
                var inventoryItem = await _inventoryItemService.GetInventoryItemByIdAsync(id);
                if (inventoryItem == null)
                {
                    _logger.LogWarning("InventoryItem with ID {InventoryItemId} not found.", id);
                    return NotFound();
                }

                _logger.LogInformation("Successfully retrieved InventoryItem with ID {InventoryItemId}.", id);
                return Ok(inventoryItem);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching campus with ID {InventoryItemId}.", id);
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<InventoryItemDTO>>> AddInventoryItem([FromBody] InventoryItemDTO dto)
        {
            _logger.LogInformation("Adding a new InventoryItem with name {ItemName}.", dto.ItemName);
            try
            {
                await _inventoryItemService.AddInventoryItemAsync(dto);
                _logger.LogInformation("Successfully added inventoryItem with ID {ItemId}.", dto.ItemId);
                return Ok(ApiResponse<InventoryItemDTO>.SuccessResponse(dto, "InventoryItem added successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new inventoryItem.");
                return StatusCode(500, ApiResponse<InventoryItemDTO>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateInventoryItem([FromBody] InventoryItemDTO dto)
        {
            _logger.LogInformation("Updating InventoryItem with ID {InventoryItemId}.", dto.ItemId);
            try
            {
                await _inventoryItemService.UpdateInventoryItemAsync(dto);
                _logger.LogInformation("Successfully updated inventoryItem with ID {ItemId}.", dto.ItemId);
                return Ok(ApiResponse<InventoryItemDTO>.SuccessResponse(dto, "InventoryItem updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating InventoryItem with ID {InventoryItemId}.", dto.ItemId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateItemDetailStatus([FromBody] ItemDetailDTO dto)
        {
            _logger.LogInformation("Updating InventoryItem with ID {InventoryItemId}.", dto);
            try
            {
                await _inventoryItemService.UpdateItemDetailStatusAsync(dto);
                _logger.LogInformation("Successfully updated inventoryItem with ID {ItemId}.", dto.ItemDetailId);
                return Ok(ApiResponse<ItemDetailDTO>.SuccessResponse(dto, "InventoryItem updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating InventoryItem with ID {InventoryItemId}.", dto.ItemId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteInventoryItem(int inventoryItemId)
        {
            _logger.LogInformation("Deleting InventoryItem with ID {InventoryItemId}.", inventoryItemId);
            try
            {
                await _inventoryItemService.DeleteInventoryItemAsync(inventoryItemId);
                _logger.LogInformation("Successfully deleted InventoryItem with ID {InventoryItemId}.", inventoryItemId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "InventoryItem deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting InventoryItem with ID {InventoryItemId}.", inventoryItemId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
