using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;

namespace SchoolManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardCountViewController : ControllerBase
    {

        private readonly IDashboardCountView _dashboardCountView;
        private readonly ILogger<DashboardCountViewController> _logger;

        public DashboardCountViewController(ILogger<DashboardCountViewController> logger, IDashboardCountView dashboardCountView)
        {
            _logger = logger;
            _dashboardCountView = dashboardCountView;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<DashboardCountViewDTO>> GetDashboardCounts()
        {
            _logger.LogInformation("Fetching all counts.");
            try
            {
                var counts = await _dashboardCountView.GetDasboardCountViewAsync();
                _logger.LogInformation("Successfully retrieved {Count} Counts.");

                return Ok(ApiResponse<DashboardCountViewDTO>.SuccessResponse(counts, "counts retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all counts.");
                return StatusCode(500, "Internal server error.");
            }
        }
    }
}
