using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskItemController : ControllerBase
    {
        private readonly ITaskItem _taskItemService;
        private readonly ILogger<TaskItemController> _logger;

        public TaskItemController(ILogger<TaskItemController> logger, ITaskItem taskItem)
        {
            _logger = logger;
            _taskItemService = taskItem;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<TaskItemDTO>>> GetTask()
        {
            _logger.LogInformation("Fetching all TaskItems.");
            try
            {
                var taskItems = await _taskItemService.GetAllTaskAsync();
                _logger.LogInformation("Successfully retrieved {Count} TaskItems.", taskItems?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<TaskItemDTO>>.SuccessResponse(taskItems, "TaskItems retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all task items.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AssignTask([FromForm] TaskItemDTO dto, IFormFile? beforeImage, IFormFile? afterImage)
        {
            _logger.LogInformation("Adding a new TaskItem with TaskName {TaskName}.", dto.TaskName);
            try
            {
                await _taskItemService.AssignTaskAsync(dto, beforeImage, afterImage);
                _logger.LogInformation("Successfully added TaskItem with ID {TaskItemId}.", dto.TaskItemId);
                return Ok(ApiResponse<TaskItemDTO>.SuccessResponse(dto, "TaskItem Added Successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new TaskItem.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateTask([FromForm] TaskItemDTO dto, IFormFile? beforeImage, IFormFile? afterImage)
        {
            _logger.LogInformation("Updating TaskItem with ID {TaskItemId}.", dto.TaskItemId);
            try
            {
                await _taskItemService.UpdateTaskAsync(dto, beforeImage, afterImage);
                _logger.LogInformation("Successfully updated TaskItem with ID {TaskItemId}.", dto.TaskItemId);
                return Ok(ApiResponse<TaskItemDTO>.SuccessResponse(dto, "TaskItem updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating TaskItem with ID {TaskItemId}.", dto.TaskItemId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteTask(int taskId)
        {
            _logger.LogInformation("Deleting TaskItem with ID {TaskItemId}.", taskId);
            try
            {
                await _taskItemService.DeleteTaskAsync(taskId);
                _logger.LogInformation("Successfully deleted TaskItem with ID {TaskItemId}.", taskId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "TaskItem deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting TaskItem with ID {TaskItemId}.", taskId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
