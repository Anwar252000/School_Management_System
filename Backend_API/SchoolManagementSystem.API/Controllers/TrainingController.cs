using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;

namespace SchoolManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrainingController : ControllerBase
    {
        private readonly ITraining _trainingService;
        private readonly ILogger<TrainingController> _logger;
        public TrainingController(ILogger<TrainingController> logger, ITraining training)
        {
            _logger = logger;
            _trainingService = training;
        }

        [HttpGet("[action]")]

        public async Task<ActionResult<IEnumerable<TrainingDTO>>> GetTraining()
        {
            _logger.LogInformation("Fetching all Training.");
            try
            {
                var training = await _trainingService.GetAllTrainingAsync();///'llEmployeeLeaveAsync();
                _logger.LogInformation("Successfully retrieved {Count} Training.", training?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<TrainingDTO>>.SuccessResponse(training, "Training retrieved successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all Training.");
                return StatusCode(500, ApiResponse<IEnumerable<TrainingDTO>>.ErrorResponse("Internal server error."));

            }
        }

        [HttpPost("[action]")]

        public async Task<ActionResult<ApiResponse<TrainingDTO>>> AddTraining([FromBody] TrainingDTO dto)
        {
            _logger.LogInformation("Adding a new Training" +
                " with name {TrainingName}.", dto.EmployeeName);
            try
            {
                await _trainingService.AddTrainingAsync(dto);
                _logger.LogInformation("Adding a new Training with name {TrainingName}.", dto.TrainingName);
                return Ok(ApiResponse<TrainingDTO>.SuccessResponse(dto, "Training Added successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new Training.");
                return StatusCode(500, "Internal server error.");
            }
        }



        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateTraining(TrainingDTO training)
        {

            _logger.LogInformation("Adding a new Training with name {TrainingName}.", training.EmployeeName);
            try
            {
                await _trainingService.UpdateTrainingAsync(training);
                _logger.LogInformation("Updating a new Training", training.EmployeeName);
                return Ok(ApiResponse<TrainingDTO>.SuccessResponse(training, "Training updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating Training with ID {TrainingId}.", training.TrainingId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteTraining(int trainingId)
        {

            _logger.LogInformation("Deleting Training with ID {TrainingId}.", trainingId);
            try
            {
                await _trainingService.DeleteTrainingAsync(trainingId);
                _logger.LogInformation("Successfully deleted Training with ID {TrainingId}.", trainingId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Training Rejected successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting appraisal with ID {TrainingId}.", trainingId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }

        }

    }

}