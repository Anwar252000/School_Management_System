using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;

[ApiController]
[Route("api/Sponsorship")]
public class SponsorshipController : ControllerBase
{
    private readonly ILogger<SponsorshipController> _logger;
    private readonly ISponsorship _sponsorshipService;
    private readonly ISponsorshipDetail _sponsorshipDetailService;

    public SponsorshipController(ILogger<SponsorshipController> logger, ISponsorship sponsorshipService, ISponsorshipDetail sponsorshipDetailService)
    {
        _logger = logger;
        _sponsorshipService = sponsorshipService;
        _sponsorshipDetailService = sponsorshipDetailService;
    }


    [HttpGet("[action]")]
    public async Task<ActionResult<ApiResponse<IEnumerable<SponsorshipDTO>>>> GetAllSponsorships()
    {
        _logger.LogInformation("Fetching all Sponsorsships.");
        try
        {
            var sponsorships = await _sponsorshipService.GetAllSponsorshipsAsync();
            _logger.LogInformation("Successfully retrieved {Count} sponsorship.", sponsorships?.Count() ?? 0);

            return Ok(ApiResponse<IEnumerable<SponsorshipDTO>>.SuccessResponse(sponsorships, "sponsorships retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching all sponsorships.");
            return StatusCode(500, ApiResponse<IEnumerable<SponsorshipDTO>>.ErrorResponse("Internal server error."));
        }
    }

    [HttpGet("[action]")]
    public async Task<ActionResult<ApiResponse<IEnumerable<SponsorshipDetailDTO>>>> GetAllSponsorshipDetails()
    {
        _logger.LogInformation("Fetching all sponsorshipDetails.");
        try
        {
            var sponsorshipDetails = await _sponsorshipDetailService.GetAllSponsorshipsDetailAsync();
            _logger.LogInformation("Successfully retrieved {Count} sponsorshipDetails.", sponsorshipDetails?.Count() ?? 0);

            return Ok(ApiResponse<IEnumerable<SponsorshipDetailDTO>>.SuccessResponse(sponsorshipDetails, "sponsorshipDetails retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching all sponsorships.");
            return StatusCode(500, ApiResponse<IEnumerable<SponsorshipDetailDTO>>.ErrorResponse("Internal server error."));
        }
    }

    [HttpGet("[action]")]
    public async Task<ActionResult<ApiResponse<IEnumerable<SponsorshipDTO>>>> GetAllStudentBySponsorId(int sponsorId)
    {
        _logger.LogInformation("Fetching all sponsor student.");
        try
        {
            var sponsorStudent = await _sponsorshipService.GetAllStudentBySponsorIdAsync(sponsorId);
            _logger.LogInformation("Successfully retrieved {Count} sponsors student.", sponsorStudent?.Count() ?? 0);

            return Ok(ApiResponse<IEnumerable<SponsorshipDTO>>.SuccessResponse(sponsorStudent, "sponsor student retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching all sponsor student.");
            return StatusCode(500, ApiResponse<IEnumerable<SponsorshipDTO>>.ErrorResponse("Internal server error."));
        }
    }


    [HttpPost("[action]")]
    public async Task<ActionResult<ApiResponse<SponsorshipDTO>>> AddSponsorship([FromBody] SponsorshipDTO dto)
    {

        _logger.LogInformation("Adding a new Sponsorship with {SponsorshipId}.", dto.SponsorName);
        try
        {
            int sponsershipId = await _sponsorshipService.AddSponsorshipAsync(dto);

            foreach (var detail in dto.Details)
            {
                detail.SponsorshipId = sponsershipId;
                await _sponsorshipDetailService.AddSponsorshipDetailAsync(detail);
            }
            _logger.LogInformation("Successfully added Sponsorship with ID {SponsorshipId}.", dto.SponsorName);
            return Ok(ApiResponse<SponsorshipDTO>.SuccessResponse(dto, "Sponsorship added successfully"));

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while adding a new Sponsorship.");
            return StatusCode(500, ApiResponse<SponsorshipDTO>.ErrorResponse("Internal server error."));
        }
    }

    [HttpPut("[action]")]
    public async Task<IActionResult> UpdateSponsorship([FromBody] SponsorshipDTO dto)
    {
        _logger.LogInformation("Updating Sponsorship with ID {SponsorshipId}.", dto.SponsorName);
        try
        {
            await _sponsorshipService.UpdateSponsorshipAsync(dto);
            _logger.LogInformation("Successfully updated SponsorshipId with ID {SponsorshipId}.", dto.SponsorName);
            return Ok(ApiResponse<SponsorshipDTO>.SuccessResponse(dto, "Sponsorship updated successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating Sponsorship with ID {SponsorshipId}.", dto.SponsorName);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
        }
    }

    [HttpDelete("[action]")]
    public async Task<IActionResult> DeleteSponsorship(int sponsorshipId)
    {
        _logger.LogInformation("Deleting sponsorship with ID {SponsorshipId}.", sponsorshipId);
        try
        {
            await _sponsorshipService.DeleteSponsorshipAsync(sponsorshipId);
            _logger.LogInformation("Successfully deleted Sponsor with ID {SponsorshipId}.", sponsorshipId);
            return Ok(ApiResponse<object>.SuccessResponse(null, "Sponsorship deleted successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting Sponsorship with ID {SponsorshipId}.", sponsorshipId);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
        }
    }
}
