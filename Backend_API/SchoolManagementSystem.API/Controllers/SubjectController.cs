using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;


namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubjectController : ControllerBase
    {
        private readonly ISubject _subjectService;
        private readonly ILogger<SubjectController> _logger;

        public SubjectController(ILogger<SubjectController> logger, ISubject sub)
        {
            _logger = logger;
            _subjectService = sub;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<SubjectDTO>>> GetSubject()
        {
            _logger.LogInformation("Fetching all Subject.");
            try
            {
                var subjects = await _subjectService.GetAllSubjectAsync();
                _logger.LogInformation("Successfully retrieved {Count} subjects.", subjects?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<SubjectDTO>>.SuccessResponse(subjects, "subjects retrieved successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all subjects.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<SubjectDTO>> GetSubjectById(int id)
        {
            _logger.LogInformation("Fetching sections with ID {SectionId}.", id);
            try
            {
                var sub = await _subjectService.GetSubjectByIdAsync(id);
                if (sub == null)
                {
                    _logger.LogWarning("subject with ID {SubjectId} not found.", id);
                    return NotFound();
                }

                _logger.LogInformation("Successfully retrieved subject with ID {SubjectId}.", id);
                return Ok(sub);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching subject with ID {SubjectId}.", id);
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<SubjectDTO>>> AddSubject([FromBody] SubjectDTO sub)
        {
            _logger.LogInformation("Adding a new subject with name {SubjectName}.", sub.SubjectName);
            try
            {
                await _subjectService.AddSubjectAsync(sub);
                _logger.LogInformation("Successfully added subject with ID {SubjectId}.", sub.SubjectId);
                return Ok(ApiResponse<SubjectDTO>.SuccessResponse(sub, "Subject Added Successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new subject.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateSubject(SubjectDTO sub)
        {

            _logger.LogInformation("Updating Subject with ID .", sub.SubjectId);
            try
            {
                await _subjectService.UpdateSubjectAsync(sub);
                _logger.LogInformation("Successfully added subject with ID {SubjectId}.", sub.SubjectId);
                return Ok(ApiResponse<SubjectDTO>.SuccessResponse(sub, "Subject updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating Subject with ID {SubjectId}.", sub.SubjectId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteSubject(int subjectId)
        {
            _logger.LogInformation("Deleting Subject with ID {SubjectId}.", subjectId);
            try
            {
                await _subjectService.DeleteSubjectAsync(subjectId);
                _logger.LogInformation("Successfully deleted subject with ID {SubjectId}.", subjectId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Subject deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting Subject with ID {SubjectId}.", subjectId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
