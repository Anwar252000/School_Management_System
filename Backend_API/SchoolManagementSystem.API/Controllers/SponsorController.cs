using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;

[ApiController]
[Route("api/Sponsors")]
public class SponsorController : ControllerBase
{
    private readonly ILogger<SponsorController> _logger;
    private readonly ISponsor _sponsorService;

    public SponsorController(ILogger<SponsorController> logger, ISponsor sponsorService)
    {
        _logger = logger;
        _sponsorService = sponsorService;
    }


    [HttpGet("[action]")]
    public async Task<ActionResult<ApiResponse<IEnumerable<SponsorDTO>>>> GetAllSponsors()
    {
        _logger.LogInformation("Fetching all Sponsors.");
        try
        {
            var sponsors = await _sponsorService.GetAllSponsorsAsync();
            _logger.LogInformation("Successfully retrieved {Count} sponsors.", sponsors?.Count() ?? 0);

            return Ok(ApiResponse<IEnumerable<SponsorDTO>>.SuccessResponse(sponsors, "Sponsors retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching all Sponsors.");
            return StatusCode(500, ApiResponse<IEnumerable<SponsorDTO>>.ErrorResponse("Internal server error."));
        }
    }

    [HttpPost("[action]")]
    public async Task<ActionResult<ApiResponse<SponsorDTO>>> AddSponsor([FromBody] SponsorDTO dto)
    {
        _logger.LogInformation("Adding a new Sponsor with name {SponsorName}.", dto.SponsorName);
        try
        {
            await _sponsorService.AddSponsorAsync(dto);
            _logger.LogInformation("Successfully added Sponsor with ID {SponsorId}.", dto.SponsorName);
            return Ok(ApiResponse<SponsorDTO>.SuccessResponse(dto, "Sponsor added successfully"));

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while adding a new Sponsor.");
            return StatusCode(500, ApiResponse<SponsorDTO>.ErrorResponse("Internal server error."));
        }
    }

    [HttpPut("[action]")]
    public async Task<IActionResult> UpdateSponsor([FromBody] SponsorDTO dto)
    {
        _logger.LogInformation("Updating Sponsor with ID {SponsorId}.", dto.SponsorId);
        try
        {
            await _sponsorService.UpdateSponsorAsync(dto);
            _logger.LogInformation("Successfully updated Sponsor with ID {SponsorId}.", dto.SponsorId);
            return Ok(ApiResponse<SponsorDTO>.SuccessResponse(dto, "Sponsor updated successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating Sponsor with ID {SponsorId}.", dto.SponsorId);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
        }
    }

    [HttpDelete("[action]")]
    public async Task<IActionResult> DeleteSponsor(int sponsorId)
    {
        _logger.LogInformation("Deleting Sponsor with ID {SponsorId}.", sponsorId);
        try
        {
            await _sponsorService.DeleteSponsorAsync(sponsorId);
            _logger.LogInformation("Successfully deleted Sponsor with ID {SponsorId}.", sponsorId);
            return Ok(ApiResponse<object>.SuccessResponse(null, "Sponsor deleted successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting Sponsor with ID {SponsorId}.", sponsorId);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
        }
    }
}
