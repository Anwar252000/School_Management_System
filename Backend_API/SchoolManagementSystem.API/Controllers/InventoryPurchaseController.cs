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
    public class InventoryPurchaseController : ControllerBase
    {
        private readonly IInventoryPurchase _inventoryPurchaseService;
        private readonly ILogger<InventoryPurchaseController> _logger;

        public InventoryPurchaseController(ILogger<InventoryPurchaseController> logger, IInventoryPurchase inventoryPurchase)
        {
            _logger = logger;
            _inventoryPurchaseService = inventoryPurchase;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ApiResponse<IEnumerable<InventoryPurchaseDTO>>>> GetInventoryPurchases()
        {
            _logger.LogInformation("Fetching all Purchases.");
            try
            {
                var inventoryPurchases = await _inventoryPurchaseService.GetAllInventoryPurchasesAsync();
                _logger.LogInformation("Successfully retrieved {Count} Inventory Purchases.", inventoryPurchases?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<InventoryPurchaseDTO>>.SuccessResponse(inventoryPurchases, "InventoryPurchases retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all Inventory Purchases.");
                return StatusCode(500, ApiResponse<IEnumerable<InventoryPurchaseDTO>>.ErrorResponse("Internal server error."));
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<InventoryPurchase>> GetInventoryPurchaseById(int id)
        {
            _logger.LogInformation("Fetching Inventory Purchase with ID {InventoryPurchaseId}.", id);
            try
            {
                var inventoryPurchase = await _inventoryPurchaseService.GetInventoryPurchaseByIdAsync(id);
                if (inventoryPurchase == null)
                {
                    _logger.LogWarning("Inventory Purchase with ID {InventoryPurchaseId} not found.", id);
                    return NotFound();
                }

                _logger.LogInformation("Successfully retrieved Inventory Purchase with ID {InventoryPurchaseId}.", id);
                return Ok(inventoryPurchase);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching campus with ID {InventoryPurchaseId}.", id);
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<InventoryPurchaseDTO>>> AddInventoryPurchase([FromBody] InventoryPurchaseDTO dto)
        {
            _logger.LogInformation("Adding a new Inventory Purchase with name {SupplierName}.", dto.SupplierName);
            try
            {
                await _inventoryPurchaseService.AddInventoryPurchaseAsync(dto);
                _logger.LogInformation("Successfully added inventoryPurchase with ID {PurchaseId}.", dto.PurchaseId);
                return Ok(ApiResponse<InventoryPurchaseDTO>.SuccessResponse(dto, "Inventory Purchase added successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new inventory Purchase.");
                return StatusCode(500, ApiResponse<InventoryPurchaseDTO>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateInventoryPurchase([FromBody] InventoryPurchaseDTO dto)
        {
            _logger.LogInformation("Updating Inventory Purchase with ID {InventoryPurchaseId}.", dto.PurchaseId);
            try
            {
                await _inventoryPurchaseService.UpdateInventoryPurchaseAsync(dto);
                _logger.LogInformation("Successfully updated inventoryPurchase with ID {PurchaseId}.", dto.PurchaseId);
                return Ok(ApiResponse<InventoryPurchaseDTO>.SuccessResponse(dto, "Inventory Purchase updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating InventoryPurchase with ID {InventoryPurchaseId}.", dto.PurchaseId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteInventoryPurchase(int purchaseId)
        {
            _logger.LogInformation("Deleting Inventory Purchase with ID {purchaseId}.", purchaseId);
            try
            {
                await _inventoryPurchaseService.DeleteInventoryPurchaseAsync(purchaseId);
                _logger.LogInformation("Successfully deleted Inventory Purchase with ID {purchaseId}.", purchaseId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "InventoryPurchase deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting Inventory Purchase with ID {purchaseId}.", purchaseId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
