using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;

[ApiController]
[Route("api/TimeTable")]
public class TimeTableController : ControllerBase
{
    private readonly ILogger<TimeTableController> _logger;
    private readonly ITimeTable _timeTableService;

    public TimeTableController(ILogger<TimeTableController> logger, ITimeTable timeTableService)
    {
        _logger = logger;
        _timeTableService = timeTableService;
    }

    //[HttpGet("[action]")]
    //public async Task<ActionResult<ApiResponse<IEnumerable<TimeTableDTO>>>> GetTimeTables()
    //{
    //    _logger.LogInformation("Fetching all TimeTable.");
    //    try
    //    {
    //        var timeTables = await _timeTableService.GetAllTimeTablesAsync();
    //        _logger.LogInformation("Successfully retrieved {Count} timeTables.", timeTables?.Count() ?? 0);

    //        return Ok(ApiResponse<IEnumerable<TimeTableDTO>>.SuccessResponse(timeTables, "timeTables retrieved successfully"));
    //    }
    //    catch (Exception ex)
    //    {
    //        _logger.LogError(ex, "An error occurred while fetching all TimeTables.");
    //        return StatusCode(500, ApiResponse<IEnumerable<TimeTableDTO>>.ErrorResponse("Internal server error."));
    //    }
    //}


    [HttpGet("[action]")]
    public async Task<ActionResult<ApiResponse<IEnumerable<TimeTableViewDTO>>>> GetTimeTables()
    {
        _logger.LogInformation("Fetching all TimeTable.");
        try
        {
            var timeTables = await _timeTableService.GetAllTimeTablesAsync();
            _logger.LogInformation("Successfully retrieved {Count} timeTables.", timeTables?.Count() ?? 0);

            return Ok(ApiResponse<IEnumerable<TimeTableViewDTO>>.SuccessResponse(timeTables, "timeTables retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching all TimeTables.");
            return StatusCode(500, ApiResponse<IEnumerable<TimeTableViewDTO>>.ErrorResponse("Internal server error."));
        }
    }

    [HttpPost("[action]")]
    public async Task<ActionResult<ApiResponse<TimeTableDTO>>> AddTimeTable([FromBody] TimeTableDTO dto)
    {
        _logger.LogInformation("Adding a new TimeTable with name {DayOfWeek}.", dto.DayOfWeek);
        try
        {
            await _timeTableService.AddTimeTableAsync(dto);
            _logger.LogInformation("Successfully added TimeTable with ID {TimeTableId}.", dto.DayOfWeek);
            return Ok(ApiResponse<TimeTableDTO>.SuccessResponse(dto, "TimeTable added successfully"));

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while adding a new TimeTable.");
            return StatusCode(500, ApiResponse<TimeTableDTO>.ErrorResponse("Internal server error."));
        }
    }

    [HttpPut("[action]")]
    public async Task<IActionResult> UpdateTimeTable([FromBody] TimeTableDTO dto)
    {
        _logger.LogInformation("Updating TimeTable with ID {TimeTableId}.", dto.TimetableId);
        try
        {
            await _timeTableService.UpdateTimeTableAsync(dto);
            _logger.LogInformation("Successfully updated TimeTable with ID {TimeTableId}.", dto.TimetableId);
            return Ok(ApiResponse<TimeTableDTO>.SuccessResponse(dto, "TimeTable updated successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating TimeTable with ID {TimeTableId}.", dto.TimetableId);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
        }
    }

    [HttpDelete("[action]")]
    public async Task<IActionResult> DeleteTimeTable(int timeTableId)
    {
        _logger.LogInformation("Deleting TimeTable with ID {TimeTableId}.", timeTableId);
        try
        {
            await _timeTableService.DeleteTimeTableAsync(timeTableId);
            _logger.LogInformation("Successfully deleted TimeTable with ID {TimeTableId}.", timeTableId);
            return Ok(ApiResponse<object>.SuccessResponse(null, "TimeTable deleted successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting TimeTable with ID {TimeTableId}.", timeTableId);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
        }
    }
}
