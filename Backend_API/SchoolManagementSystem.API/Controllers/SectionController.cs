using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;


namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SectionController : ControllerBase
    {
        private readonly ISection _sectionService;
        private readonly ILogger<SectionController> _logger;

        public SectionController(ILogger<SectionController> logger, ISection sec)
        {
            _logger = logger;
            _sectionService = sec;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<SectionDTO>>> GetSection()
        {
            _logger.LogInformation("Fetching all sections.");
            try
            {
                var sections = await _sectionService.GetAllSectionAsync();
                _logger.LogInformation("Successfully retrieved {Count} sections.", sections?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<SectionDTO>>.SuccessResponse(sections, "sections retrieved successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all sections.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<SectionDTO>> GetSectionById(int id)
        {
            _logger.LogInformation("Fetching sections with ID {SectionId}.", id);
            try
            {
                var sec = await _sectionService.GetSectionByIdAsync(id);
                if (sec == null)
                {
                    _logger.LogWarning("section with ID {SectionId} not found.", id);
                    return NotFound();
                }

                _logger.LogInformation("Successfully retrieved section with ID {SectionId}.", id);
                return Ok(sec);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching section with ID {SectionId}.", id);
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<SectionDTO>>> AddSection([FromBody] SectionDTO sec)
        {
            _logger.LogInformation("Adding a new section with name {SectionName}.", sec.SectionName);
            try
            {
                await _sectionService.AddSectionAsync(sec);
                _logger.LogInformation("Successfully added section with ID {SectionId}.", sec.SectionId);
                return Ok(ApiResponse<SectionDTO>.SuccessResponse(sec, "Section Added Successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new section.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateSection(SectionDTO sec)
        {

            _logger.LogInformation("Updating Section with ID .", sec.SectionId);
            try
            {
                await _sectionService.UpdateSectionAsync(sec);
                _logger.LogInformation("Successfully updated Section with ID SectionId.", sec.SectionId);
                return Ok(ApiResponse<SectionDTO>.SuccessResponse(sec, "Section updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating Section with ID {SectionId}.", sec.SectionId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteSection(int sectionId)
        {
            _logger.LogInformation("Deleting selection with ID {SectionId}.", sectionId);
            try
            {
                await _sectionService.DeleteSectionAsync(sectionId);
                _logger.LogInformation("Successfully deleted section with ID {SectionId}.", sectionId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Section deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting Section with ID {SectionId}.", sectionId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
