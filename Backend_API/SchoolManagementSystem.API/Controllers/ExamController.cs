using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;


[ApiController]
[Route("api/Exams")]
public class ExamController : ControllerBase
{
    private readonly ILogger<ExamController> _logger;
    private readonly IExam _examService;

    public ExamController(ILogger<ExamController> logger, IExam exam)
    {
        _logger = logger;
        _examService = exam;
    }



    [HttpGet("[action]")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ExamDTO>>>> GetAllExams()
    {
        _logger.LogInformation("Fetching all Exams.");
        try
        {
            var exams = await _examService.GetAllExamsAsync();
            _logger.LogInformation("Successfully retrieved {Count} All Exams.", exams?.Count() ?? 0);

            return Ok(ApiResponse<IEnumerable<ExamDTO>>.SuccessResponse(exams, "Exams retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching exams.");
            return StatusCode(500, ApiResponse<IEnumerable<ExamDTO>>.ErrorResponse("Internal server error."));
        }
    }

    [HttpPost("[action]")]
    public async Task<ActionResult<ApiResponse<ExamDTO>>> AddExams([FromBody] ExamDTO dto)
    {
        _logger.LogInformation("Adding a new Exam with Id {ExamId}.", dto.ExamId);
        try
        {
            await _examService.AddExamAsync(dto);
            _logger.LogInformation("Successfully added Exam with ID {ExamId}.", dto.ExamId);
            return Ok(ApiResponse<ExamDTO>.SuccessResponse(dto, "Exam added successfully"));

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while adding a new Exam.");
            return StatusCode(500, ApiResponse<ExamDTO>.ErrorResponse("Internal server error."));
        }
    }

    [HttpPut("[action]")]
    public async Task<IActionResult> UpdateExam([FromBody] ExamDTO dto)
    {
        _logger.LogInformation("Updating Exam with ID {ExamId}.", dto.ExamId);
        try
        {
            await _examService.UpdateExamAsync(dto);
            _logger.LogInformation("Successfully updated Exam with ID {ExamId}.", dto.ExamId);
            return Ok(ApiResponse<ExamDTO>.SuccessResponse(dto, "Exam updated successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating Exam with ID {ExamId}.", dto.ExamId);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
        }
    }

    [HttpDelete("[action]")]
    public async Task<IActionResult> DeleteExam(int examId)
    {
        _logger.LogInformation("Deleting Exam with ID {ExamId}.", examId);
        try
        {
            await _examService.DeleteExamAsync(examId);
            _logger.LogInformation("Successfully deleted Exam with ID {ExamId}.", examId);
            return Ok(ApiResponse<object>.SuccessResponse(null, "Exam deleted successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting Exam with ID {ExamId}.", examId);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
        }
    }

    [HttpGet("[action]")]
    public async Task<ActionResult<ExamDTO>> GetExamById(int examId)
    {
        _logger.LogInformation("Fetching Exams with ID {ExamId}.", examId);
        try
        {
            var exams = await _examService.GetByExamIdAsync(examId);
            if (exams == null)
            {
                _logger.LogWarning("exam with ID {ExamId} not found.", examId);
                return NotFound();
            }

            _logger.LogInformation("Successfully retrieved exam with ID {ExamId}.", examId);
            return Ok(exams);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching exam with ID {ExamId}.", examId);
            return StatusCode(500, "Internal server error.");
        }
    }
}
