using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;

[ApiController]
[Route("api/Period")]
public class PeriodController : ControllerBase
{
    private readonly ILogger<PeriodController> _logger;
    private readonly IPeriod _periodService;

    public PeriodController(ILogger<PeriodController> logger, IPeriod periodService)
    {
        _logger = logger;
        _periodService = periodService;
    }

    [HttpGet("[action]")]
    public async Task<ActionResult<ApiResponse<IEnumerable<PeriodDTO>>>> GetAllPeriods()
    {
        _logger.LogInformation("Fetching all Periods.");
        try
        {
            var periods = await _periodService.GetAllPeriodAsync();
            _logger.LogInformation("Successfully retrieved {Count} periods.", periods?.Count() ?? 0);

            return Ok(ApiResponse<IEnumerable<PeriodDTO>>.SuccessResponse(periods, "Periods retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching all Periods.");
            return StatusCode(500, ApiResponse<IEnumerable<PeriodDTO>>.ErrorResponse("Internal server error."));
        }
    }

    [HttpPost("[action]")]
    public async Task<ActionResult<ApiResponse<PeriodDTO>>> AddPeriod([FromBody] PeriodDTO dto)
    {
        _logger.LogInformation("Adding a new Period with name {PeriodName}.", dto.PeriodName);
        try
        {
            await _periodService.AddPeriodAsync(dto);
            _logger.LogInformation("Successfully added Period with ID {PeriodId}.", dto.PeriodId);
            return Ok(ApiResponse<PeriodDTO>.SuccessResponse(dto, "Period added successfully"));

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while adding a new Period.");
            return StatusCode(500, ApiResponse<PeriodDTO>.ErrorResponse("Internal server error."));
        }
    }

    [HttpPut("[action]")]
    public async Task<IActionResult> UpdatePeriod([FromBody] PeriodDTO dto)
    {
        _logger.LogInformation("Updating Period with ID {PeriodId}.", dto.PeriodId);
        try
        {
            await _periodService.UpdatePeriodAsync(dto);
            _logger.LogInformation("Successfully updated Period with ID {PeriodId}.", dto.PeriodId);
            return Ok(ApiResponse<PeriodDTO>.SuccessResponse(dto, "Period updated successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating Period with ID {PeriodId}.", dto.PeriodId);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
        }
    }

    [HttpDelete("[action]")]
    public async Task<IActionResult> DeletePeriod(int periodId)
    {
        _logger.LogInformation("Deleting Period with ID {PeriodId}.", periodId);
        try
        {
            await _periodService.DeletePeriodAsync(periodId);
            _logger.LogInformation("Successfully deleted Period with ID {PeriodId}.", periodId);
            return Ok(ApiResponse<object>.SuccessResponse(null, "Period deleted successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting Period with ID {PeriodId}.", periodId);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
        }
    }
}
