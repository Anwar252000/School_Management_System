using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssetAllocationController : ControllerBase
    {
        private readonly IAssetAllocation _assetAllocationService;
        private readonly ILogger<AssetAllocationController> _logger;

        public AssetAllocationController(ILogger<AssetAllocationController> logger, IAssetAllocation assetAllocation)
        {
            _logger = logger;
            _assetAllocationService = assetAllocation;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ApiResponse<IEnumerable<AssetAllocationDTO>>>> GetAllAllocatedAssets()
        {
            _logger.LogInformation("Fetching all AllocatedAssets.");
            try
            {
                var allocatedAssets = await _assetAllocationService.GetAllAllocatedAssetsAsync();
                _logger.LogInformation("Successfully retrieved {Count} AllocatedAssets.", allocatedAssets?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<AssetAllocationDTO>>.SuccessResponse(allocatedAssets, "AllocatedAssets retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all AllocatedAssets.");
                return StatusCode(500, ApiResponse<IEnumerable<AssetAllocationDTO>>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<AssetAllocationDTO>>> AllocateAsset([FromBody] AssetAllocationDTO dto)
        {
            _logger.LogInformation("Allocate new Asset with name {ItemName}.", dto.ItemName);
            try
            {
                await _assetAllocationService.AllocateAssetAsync(dto);
                _logger.LogInformation("Successfully Allocate new Asset with ID {AllocationId}.", dto.AllocationId);
                return Ok(ApiResponse<AssetAllocationDTO>.SuccessResponse(dto, "Allocate Asset successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while allocate new asset.");
                return StatusCode(500, ApiResponse<AssetAllocationDTO>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateAllocatedAsset([FromBody] AssetAllocationDTO dto)
        {
            _logger.LogInformation("Updating AllocatedAsset with ID {AllocationId}.", dto.AllocationId);
            try
            {
                await _assetAllocationService.UpdateAllocatedAssetAsync(dto);
                _logger.LogInformation("Successfully updated AllocatedAsset with ID {AllocationId}.", dto.AllocationId);
                return Ok(ApiResponse<AssetAllocationDTO>.SuccessResponse(dto, "AllocatedAsset updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating AllocatedAsset with ID {AllocationId}.", dto.AllocationId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteAllocatedAsset(int allocationId)
        {
            _logger.LogInformation("Deleting AllocatedAsset with ID {allocationId}.", allocationId);
            try
            {
                await _assetAllocationService.DeleteAllocatedAssetAsync(allocationId);
                _logger.LogInformation("Successfully deleted AssetAllocation with ID {AllocationId}.", allocationId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "AllocatedAsset deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting AllocatedAsset with ID {AllocationId}.", allocationId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
