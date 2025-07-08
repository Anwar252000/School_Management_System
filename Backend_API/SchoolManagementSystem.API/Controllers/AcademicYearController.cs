using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AcademicYearController : ControllerBase
    {
        private readonly IAcademicYear _academicYearService;
        private readonly ILogger<AcademicYearController> _logger;

        public AcademicYearController(ILogger<AcademicYearController> logger, IAcademicYear academicYear)
        {
            _logger = logger;
            _academicYearService = academicYear;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<AcademicYearDTO>>> GetAllAcademicYears()
        {
            _logger.LogInformation("Fetching all academic years.");
            try
            {
                var academicYears = await _academicYearService.GetAllAcademicYearAsync();
                _logger.LogInformation("Successfully retrieved {Count} academic years.", academicYears?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<AcademicYearDTO>>.SuccessResponse(academicYears, "Academic years retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all academic years.");
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpGet("[action]/{id}")]
        public async Task<ActionResult<AcademicYearDTO>> GetAcademicYearById(int id)
        {
            _logger.LogInformation("Fetching academic year with ID {AcademicYearId}.", id);
            try
            {
                var academicYear = await _academicYearService.GetAcademicYearByIdAsync(id);
                if (academicYear == null)
                {
                    _logger.LogWarning("Academic year with ID {AcademicYearId} not found.", id);
                    return NotFound(ApiResponse<object>.ErrorResponse("Academic year not found."));
                }

                _logger.LogInformation("Successfully retrieved academic year with ID {AcademicYearId}.", id);
                return Ok(ApiResponse<AcademicYearDTO>.SuccessResponse(academicYear, "Academic year retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching academic year with ID {AcademicYearId}.", id);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<AcademicYearDTO>> AddAcademicYear(AcademicYearDTO academicYear)
        {
            _logger.LogInformation("Adding a new academic year.");
            try
            {
                await _academicYearService.AddAcademicYearAsync(academicYear);
                _logger.LogInformation("Successfully added academic year with ID {AcademicYearId}.", academicYear.AcademicYearId);
                return Ok(ApiResponse<AcademicYearDTO>.SuccessResponse(academicYear, "Academic year added successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new academic year.");
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateAcademicYear([FromBody] AcademicYearDTO academicYear)
        {
            _logger.LogInformation("Updating academic year with ID {AcademicYearId}.", academicYear.AcademicYearId);
            try
            {
                await _academicYearService.UpdateAcademicYearAsync(academicYear);
                _logger.LogInformation("Successfully updated academic year with ID {AcademicYearId}.", academicYear.AcademicYearId);
                return Ok(ApiResponse<AcademicYearDTO>.SuccessResponse(academicYear, "Academic year updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating academic year with ID {AcademicYearId}.", academicYear.AcademicYearId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteAcademicYear(int id)
        {
            _logger.LogInformation("Deleting academic year with ID {AcademicYearId}.", id);
            try
            {
                await _academicYearService.DeleteAcademicYearAsync(id);
                _logger.LogInformation("Successfully deleted academic year with ID {AcademicYearId}.", id);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Academic year deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting academic year with ID {AcademicYearId}.", id);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<AcademicYearDTO>>> GetAcademicYearByYear(string? academicYear)
        {
            _logger.LogInformation("Fetching academic year for year {AcademicYear}.", academicYear);
            try
            {
                var results = await _academicYearService.GetAcademicYearByYear(academicYear);

                if (results == null || !results.Any())
                {
                    _logger.LogWarning("No academic years found for year {AcademicYear}.", academicYear);
                    return NotFound(ApiResponse<object>.ErrorResponse("No academic years found for the specified year."));
                }

                _logger.LogInformation("Successfully retrieved {Count} academic years for year {AcademicYear}.", results.Count(), academicYear);
                return Ok(ApiResponse<IEnumerable<AcademicYearDTO>>.SuccessResponse(results, "Academic years retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching academic year for year {AcademicYear}.", academicYear);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
