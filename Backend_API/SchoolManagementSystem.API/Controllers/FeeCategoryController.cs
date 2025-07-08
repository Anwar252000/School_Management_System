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
    public class FeeCategoryController : ControllerBase
    {
        private readonly IFeeCategory _feeService;
        private readonly ILogger<FeeCategoryController> _logger;

        public FeeCategoryController(ILogger<FeeCategoryController> logger, IFeeCategory feeCategory)
        {
            _logger = logger;
            _feeService = feeCategory;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ApiResponse<IEnumerable<FeeCategoryDTO>>>> GetFeeCategories()
        {
            _logger.LogInformation("Fetching all FeeCategories.");
            try
            {
                var FeeCategory = await _feeService.GetAllFeeCategoriesAsync();
                _logger.LogInformation("Successfully retrieved {Count} FeeCategories.", FeeCategory?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<FeeCategoryDTO>>.SuccessResponse(FeeCategory, "FeeCategory retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all Fee Categories.");
                return StatusCode(500, ApiResponse<IEnumerable<FeeCategoryDTO>>.ErrorResponse("Internal server error."));
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<FeeCategoryDTO>> GetFeeCategoryById(int feeCategoryId)
        {
            _logger.LogInformation("Fetching Fee Category with ID {FeeCategoryId}.", feeCategoryId);
            try
            {
                var feeCategory = await _feeService.GetFeeCategoryByIdAsync(feeCategoryId);
                if (feeCategory == null)
                {
                    _logger.LogWarning("Fee Category with ID {FeeCategoryId} not found.", feeCategory);
                    return NotFound();
                }

                _logger.LogInformation("Successfully retrieved Fee Category with ID {FeeCategoryId}.", feeCategory);
                return Ok(feeCategory);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching Fee Category with ID {FeeCategoryId}.", feeCategoryId);
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<FeeCategoryDTO>>> AddFeeCategory([FromBody] FeeCategoryDTO dto)
        {
            _logger.LogInformation("Adding a new Fee Category with name {FeeName}.", dto.FeeName);
            try
            {
                await _feeService.AddFeeCategoryAsync(dto);
                _logger.LogInformation("Successfully added Fee Category with ID {FeeCategoryId}.", dto.FeeCategoryId);
                return Ok(ApiResponse<FeeCategoryDTO>.SuccessResponse(dto, "Fee Category added successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new fee category.");
                return StatusCode(500, ApiResponse<FeeCategoryDTO>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateFeeCategory([FromBody] FeeCategoryDTO dto)
        {
            _logger.LogInformation("Updating Fee Category with ID {FeeCategoryId}.", dto.FeeCategoryId);
            try
            {
                await _feeService.UpdateFeeCategoryAsync(dto);
                _logger.LogInformation("Successfully updated fee category with ID {FeeCategoryId}.", dto.FeeCategoryId);
                return Ok(ApiResponse<FeeCategoryDTO>.SuccessResponse(dto, "Fee Category updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating Fee Category with ID {FeeCategoryId}.", dto.FeeCategoryId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteFeeCategory(int feeCategoryId)
        {
            _logger.LogInformation("Deleting Fee Category with ID {FeeCategoryId}.", feeCategoryId);
            try
            {
                await _feeService.DeleteFeeCategoryAsync(feeCategoryId);
                _logger.LogInformation("Successfully deleted Fee Category with ID {feeCategoryId}.", feeCategoryId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Fee Category deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting Fee Category with ID {feeCategoryId}.", feeCategoryId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
