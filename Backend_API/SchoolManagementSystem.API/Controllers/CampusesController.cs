using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;

[ApiController]
[Route("api/campuses")]
public class CampusesController : ControllerBase
{
    private readonly ILogger<CampusesController> _logger;
    private readonly ICampuses _campusService;

    public CampusesController(ILogger<CampusesController> logger, ICampuses campus)
    {
        _logger = logger;
        _campusService = campus;
    }

    //[Authorize(Roles = "Admin, SuperUser")]
    [HttpGet("[action]")]
    public async Task<ActionResult<ApiResponse<IEnumerable<CampusDTO>>>> GetCampuses()
    {
        _logger.LogInformation("Fetching all Campuses.");
        try
        {
            var campuses = await _campusService.GetAllCampusesAsync();
            _logger.LogInformation("Successfully retrieved {Count} campuses.", campuses?.Count() ?? 0);

            return Ok(ApiResponse<IEnumerable<CampusDTO>>.SuccessResponse(campuses, "Campuses retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching all Campuses.");
            return StatusCode(500, ApiResponse<IEnumerable<CampusDTO>>.ErrorResponse("Internal server error."));
        }
    }

    [HttpGet("[action]")]
    public async Task<ActionResult<ApiResponse<CampusDTO>>> GetCampusById(int id)
    {
        _logger.LogInformation("Fetching campus with ID {CampusId}.", id);
        try
        {
            var campus = await _campusService.GetCampusByIdAsync(id);
            if (campus == null)
            {
                _logger.LogWarning("Campus with ID {CampusId} not found.", id);
                return NotFound(ApiResponse<CampusDTO>.ErrorResponse("Campus not found"));
            }

            _logger.LogInformation("Successfully retrieved campus with ID {CampusId}.", id);
            return Ok(ApiResponse<CampusDTO>.SuccessResponse(campus, "Campus retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching campus with ID {CampusId}.", id);
            return StatusCode(500, ApiResponse<Campus>.ErrorResponse("Internal server error."));
        }
    }

    [HttpPost("[action]")]
    public async Task<ActionResult<ApiResponse<CampusDTO>>> AddCampus([FromBody] CampusDTO dto)
    {
        _logger.LogInformation("Adding a new Campus with name {CampusName}.", dto.CampusName);
        try
        {
            await _campusService.AddCampusAsync(dto);
            _logger.LogInformation("Successfully added campus with ID {CampusId}.", dto.CampusId);
            return Ok(ApiResponse<CampusDTO>.SuccessResponse(dto, "Campus added successfully"));

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while adding a new campus.");
            return StatusCode(500, ApiResponse<CampusDTO>.ErrorResponse("Internal server error."));
        }
    }

    [HttpPut("[action]")]
    public async Task<IActionResult> UpdateCampus([FromBody] CampusDTO campus)
    {
        _logger.LogInformation("Updating Campus with ID {CampusId}.", campus.CampusId);
        try
        {
            await _campusService.UpdateCampusAsync(campus);
            _logger.LogInformation("Successfully updated campus with ID {CampusId}.", campus.CampusId);
            return Ok(ApiResponse<CampusDTO>.SuccessResponse(campus, "Campus updated successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating Campus with ID {CampusId}.", campus.CampusId);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
        }
    }

    [HttpDelete("[action]")]
    public async Task<IActionResult> DeleteCampus(int campusId)
    {
        _logger.LogInformation("Deleting campus with ID {CampusId}.", campusId);
        try
        {
            await _campusService.DeleteCampusAsync(campusId);
            _logger.LogInformation("Successfully deleted campus with ID {CampusId}.", campusId);
            return Ok(ApiResponse<object>.SuccessResponse(null, "Campus deleted successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting Campus with ID {CampusId}.", campusId);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
        }
    }
}
