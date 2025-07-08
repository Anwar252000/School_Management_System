using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;

namespace SchoolManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PerformanceAppraisalController : ControllerBase
    {
        private readonly IPerformanceAppraisal _appraisalService;
        private readonly ILogger<PerformanceAppraisalController> _logger;
        public PerformanceAppraisalController(ILogger<PerformanceAppraisalController> logger, IPerformanceAppraisal appraisal)
        {
            _logger = logger;
            _appraisalService = appraisal;
        }

        [HttpGet("[action]")]

        public async Task<ActionResult<IEnumerable<PerformanceAppraisalDTO>>> GetPerformanceAppraisal()
        {
            _logger.LogInformation("Fetching all Performance Appraisal.");
            try
            {
                var appraisal = await _appraisalService.GetAllPerformanceAppraisalAsync();///'llEmployeeLeaveAsync();
                _logger.LogInformation("Successfully retrieved {Count} appraisal.", appraisal?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<PerformanceAppraisalDTO>>.SuccessResponse(appraisal, "Performance Appraisal retrieved successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all Performance Appraisal.");
                return StatusCode(500, ApiResponse<IEnumerable<PerformanceAppraisalDTO>>.ErrorResponse("Internal server error."));

            }
        }

        [HttpPost("[action]")]

        public async Task<ActionResult<ApiResponse<PerformanceAppraisalDTO>>> AddPerformanceAppraisal([FromBody] PerformanceAppraisalDTO dto)
        {
            _logger.LogInformation("Adding a new Performance Appraisal" +
                " with name {EmployeeLeaveName}.", dto.EmployeeName);
            try
            {
                await _appraisalService.AddPerformanceAppraisalAsync(dto);
                _logger.LogInformation("Adding a new Performance Appraisal with name {PerformanceAppraisal}.", dto.EmployeeName);
                return Ok(ApiResponse<PerformanceAppraisalDTO>.SuccessResponse(dto, "Performance Appraisal Added successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new Performance Appraisal.");
                return StatusCode(500, "Internal server error.");
            }
        }



        [HttpPut("[action]")]
        public async Task<IActionResult> UpdatePerformanceAppraisal(PerformanceAppraisalDTO appraisal)
        {

            _logger.LogInformation("updating a new Performance Appraisal with name {PerformanceAppraisal}.", appraisal.EmployeeName);
            try
            {
                await _appraisalService.UpdatePerformanceAppraisalAsync(appraisal);
                _logger.LogInformation("Updating a new Performance Appraisal", appraisal.EmployeeName);
                return Ok(ApiResponse<PerformanceAppraisalDTO>.SuccessResponse(appraisal, "Performance Appraisal updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating role with ID {AppraisalId}.", appraisal.AppraisalId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
        [HttpDelete("[action]")]
        public async Task<IActionResult> DeletePerformanceAppraisal(int appraisalId)
        {

            _logger.LogInformation("Deleting appraisal with ID {AppraisalId}.", appraisalId);
            try
            {
                await _appraisalService.DeletePerformanceAppraisalAsync(appraisalId);
                _logger.LogInformation("Successfully deleted appraisal with ID {AppraisalId}.", appraisalId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "appraisal Rejected successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting appraisal with ID {AppraisalIdId}.", appraisalId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }

        }

    }

}