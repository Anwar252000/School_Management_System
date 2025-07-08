using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryStockController : ControllerBase
    {
        private readonly IInventoryStocks _inventoryStockService;
        private readonly ILogger<InventoryStockController> _logger;

        public InventoryStockController(ILogger<InventoryStockController> logger, IInventoryStocks inventoryStock)
        {
            _logger = logger;
            _inventoryStockService = inventoryStock;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ApiResponse<IEnumerable<InventoryStockViewDTO>>>> GetInventoryStocks()
        {
            _logger.LogInformation("Fetching all InventoryStocks.");
            try
            {
                var inventoryStocks = await _inventoryStockService.GetAllInventoryStocksAsync();
                _logger.LogInformation("Successfully retrieved {Count} InventoryStocks.", inventoryStocks?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<InventoryStockViewDTO>>.SuccessResponse(inventoryStocks, "InventoryStocks retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all InventoryStocks.");
                return StatusCode(500, ApiResponse<IEnumerable<InventoryStockViewDTO>>.ErrorResponse("Internal server error."));
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ApiResponse<IEnumerable<InventoryStockDTO>>>> GetInventoryStocksByItemId(int itemId)
        {
            _logger.LogInformation("Fetching all InventoryStocks By ItemId.");
            try
            {
                var inventoryStocks = await _inventoryStockService.GetInventoryStocksByItemIdAsync(itemId);
                _logger.LogInformation("Successfully retrieved {Count} InventoryStocks.", inventoryStocks?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<InventoryStockDTO>>.SuccessResponse(inventoryStocks, "InventoryStocks retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all InventoryStocks.");
                return StatusCode(500, ApiResponse<IEnumerable<InventoryStockDTO>>.ErrorResponse("Internal server error."));
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<InventoryStock>> GetInventoryStockById(int id)
        {
            _logger.LogInformation("Fetching InventoryStock with ID {InventoryStockId}.", id);
            try
            {
                var inventoryStock = await _inventoryStockService.GetInventoryStockByIdAsync(id);
                if (inventoryStock == null)
                {
                    _logger.LogWarning("InventoryStock with ID {InventoryStockId} not found.", id);
                    return NotFound();
                }

                _logger.LogInformation("Successfully retrieved InventoryStock with ID {InventoryStockId}.", id);
                return Ok(inventoryStock);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching campus with ID {InventoryStockId}.", id);
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<InventoryStockDTO>>> AddInventoryStock([FromBody] InventoryStockDTO dto)
        {
            _logger.LogInformation("Adding a new InventoryStock with name {ItemName}.", dto.ItemName);
            try
            {
                await _inventoryStockService.AddInventoryStockAsync(dto);
                _logger.LogInformation("Successfully added inventoryStock with ID {ItemId}.", dto.ItemId);
                return Ok(ApiResponse<InventoryStockDTO>.SuccessResponse(dto, "InventoryStock added successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new inventoryStock.");
                return StatusCode(500, ApiResponse<InventoryStockDTO>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateInventoryStock([FromBody] InventoryStockDTO dto)
        {
            _logger.LogInformation("Updating InventoryStock with ID {InventoryStockId}.", dto.StockId);
            try
            {
                await _inventoryStockService.UpdateInventoryStockAsync(dto);
                _logger.LogInformation("Successfully updated inventoryStock with ID {ItemId}.", dto.StockId);
                return Ok(ApiResponse<InventoryStockDTO>.SuccessResponse(dto, "InventoryStock updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating InventoryStock with ID {InventoryStockId}.", dto.StockId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteInventoryStock(int inventoryStockId)
        {
            _logger.LogInformation("Deleting InventoryStock with ID {InventoryStockId}.", inventoryStockId);
            try
            {
                await _inventoryStockService.DeleteInventoryStockAsync(inventoryStockId);
                _logger.LogInformation("Successfully deleted InventoryStock with ID {InventoryStockId}.", inventoryStockId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "InventoryStock deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting InventoryStock with ID {InventoryStockId}.", inventoryStockId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
