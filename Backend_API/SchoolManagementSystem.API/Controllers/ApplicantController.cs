using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicantController : ControllerBase
    {
        private readonly IApplicant _applicantService;
        private readonly ILogger<ApplicantController> _logger;

        public ApplicantController(ILogger<ApplicantController> logger, IApplicant applicant)
        {
            _logger = logger;
            _applicantService = applicant;
        }

        //[Authorize(Roles = "Admin")]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<ApplicantApplicationViewDTO>>> GetAllApplicants()
        {
            _logger.LogInformation("Fetching all applicants.");
            try
            {
                var applicants = await _applicantService.GetAllApplicantApplicationAsync();
                _logger.LogInformation("Successfully retrieved {Count} applicants.", applicants?.Count() ?? 0);
                return Ok(ApiResponse<IEnumerable<ApplicantApplicationViewDTO>>.SuccessResponse(applicants, "Applicants retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all applicant.");
                return StatusCode(500, ApiResponse<IEnumerable<ApplicantApplicationViewDTO>>.ErrorResponse("Internal server error."));
            }
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Applicant>> GetApplicantById(int appId)
        {
            _logger.LogInformation("Fetching applicant with Id {ApplicantId}.", appId);
            try
            {
                var applicants = await _applicantService.GetApplicantByIdAsync(appId);
                if (applicants == null)
                {
                    _logger.LogWarning("Applicant with Id {ApplicantId} not found.", appId);
                    return NotFound();
                }

                _logger.LogInformation("Successfully retrieved Applicant with Id {ApplicantId}.", appId);
                return Ok(applicants);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching applicant with Id {ApplicantId}.", appId);
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<ApplicantDTO>>> AddApplicant([FromBody] ApplicantAdmissionDTO dto)
        {
            _logger.LogInformation("Adding a new Applicant with name {FirstName}.", dto.Applicant.FirstName);
            try
            {

                var applicantId = await _applicantService.AddApplicantAsync(dto.Applicant);
                await _applicantService.AddAdmissionApplicationAsync(dto.Application, applicantId);
                _logger.LogInformation("Successfully added applicant with ID {ApplicantId}.", dto.Applicant.ApplicantId);
                return Ok(ApiResponse<ApplicantAdmissionDTO>.SuccessResponse(dto, "Applicant added successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new applicant.");
                return StatusCode(500, ApiResponse<ApplicantDTO>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateApplicant(ApplicantAdmissionDTO dto)
        {
            _logger.LogInformation("Updating applicant with ID {ApplicantId}.", dto.Application.ApplicationId);
            try
            {
                await _applicantService.UpdateApplicantAsync(dto.Applicant);
                await _applicantService.UpdateApplicationAsync(dto.Application);
                _logger.LogInformation("Successfully updated Applicant with ID {ApplicantId}.", dto.Application.ApplicationId);
                return Ok(ApiResponse<ApplicantAdmissionDTO>.SuccessResponse(dto, "Applicant updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating Applicant with ID {ApplicantId}.", dto.Application.ApplicationId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteApplicant(int appId)
        {
            _logger.LogInformation("Deleting applicant with ID {ApplicantId}.", appId);
            try
            {
                await _applicantService.DeleteApplicantAsync(appId);
                _logger.LogInformation("Successfully deleted applicant with ID {ApplicantId}.", appId);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting applicant with ID {ApplicantId}.", appId);
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> ApplicationStatus(ApplicationUpdateStatusDTO dto)
        {
            _logger.LogInformation("Updating Application Status with ID {ApplicationId}.", dto.ApplicationId);
            try
            {
                await _applicantService.ApplicationStatus(dto);
                _logger.LogInformation("Successfully updated Application status with ID {ApplicationId}.", dto.ApplicationId);
                return Ok(ApiResponse<object>.SuccessResponse(dto.ApplicationId, "Application Status updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while Updating application status with ID {ApplicationId}.", dto.ApplicationId);
                return StatusCode(500, "Internal server error.");
            }
        }
    }
}
