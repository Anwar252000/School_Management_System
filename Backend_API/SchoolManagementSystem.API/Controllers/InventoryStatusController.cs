using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryStatusController : ControllerBase
    {
        private readonly IInventoryStatus _inventoryStatusService;
        private readonly ILogger<InventoryStatusController> _logger;

        public InventoryStatusController(ILogger<InventoryStatusController> logger, IInventoryStatus inventoryStatus)
        {
            _logger = logger;
            _inventoryStatusService = inventoryStatus;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ApiResponse<IEnumerable<InventoryStatusDTO>>>> GetInventoryStatus()
        {
            _logger.LogInformation("Fetching all InventoryStatus.");
            try
            {
                var inventoryStatus = await _inventoryStatusService.GetAllInventoryStatusAsync();
                _logger.LogInformation("Successfully retrieved {Count} InventoryStatus.", inventoryStatus?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<InventoryStatusDTO>>.SuccessResponse(inventoryStatus, "InventoryStatus retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all InventoryStatus.");
                return StatusCode(500, ApiResponse<IEnumerable<InventoryStatusDTO>>.ErrorResponse("Internal server error."));
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<InventoryStatus>> GetInventoryStatusById(int id)
        {
            _logger.LogInformation("Fetching InventoryStatus with ID {InventoryStatusId}.", id);
            try
            {
                var inventoryStatus = await _inventoryStatusService.GetInventoryStatusByIdAsync(id);
                if (inventoryStatus == null)
                {
                    _logger.LogWarning("InventoryStatus with ID {InventoryStatusId} not found.", id);
                    return NotFound();
                }

                _logger.LogInformation("Successfully retrieved InventoryStatus with ID {InventoryStatusId}.", id);
                return Ok(inventoryStatus);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching campus with ID {InventoryStatusId}.", id);
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<InventoryStatusDTO>>> AddInventoryStatus([FromBody] InventoryStatusDTO dto)
        {
            _logger.LogInformation("Adding a new InventoryStatus with name {StatusName}.", dto.StatusName);
            try
            {
                await _inventoryStatusService.AddInventoryStatusAsync(dto);
                _logger.LogInformation("Successfully added inventoryStatus with ID {StatusId}.", dto.StatusId);
                return Ok(ApiResponse<InventoryStatusDTO>.SuccessResponse(dto, "InventoryStatus added successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new inventoryStatus.");
                return StatusCode(500, ApiResponse<InventoryStatusDTO>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateInventoryStatus([FromBody] InventoryStatusDTO dto)
        {
            _logger.LogInformation("Updating InventoryStatus with ID {InventoryStatusId}.", dto.StatusId);
            try
            {
                await _inventoryStatusService.UpdateInventoryStatusAsync(dto);
                _logger.LogInformation("Successfully updated inventoryStatus with ID {StatusId}.", dto.StatusId);
                return Ok(ApiResponse<InventoryStatusDTO>.SuccessResponse(dto, "InventoryStatus updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating InventoryStatus with ID {InventoryStatusId}.", dto.StatusId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteInventoryStatus(int inventoryStatusId)
        {
            _logger.LogInformation("Deleting InventoryStatus with ID {InventoryStatusId}.", inventoryStatusId);
            try
            {
                await _inventoryStatusService.DeleteInventoryStatusAsync(inventoryStatusId);
                _logger.LogInformation("Successfully deleted InventoryStatus with ID {InventoryStatusId}.", inventoryStatusId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "InventoryStatus deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting InventoryStatus with ID {InventoryStatusId}.", inventoryStatusId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
