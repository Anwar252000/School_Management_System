using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;

[ApiController]
[Route("api/ExamPapers")]
public class ExamPaperController : ControllerBase
{
    private readonly ILogger<ExamPaperController> _logger;
    private readonly IExamPaper _examPaperService;

    public ExamPaperController(ILogger<ExamPaperController> logger, IExamPaper examPaper)
    {
        _logger = logger;
        _examPaperService = examPaper;
    }



    [HttpGet("[action]")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ExamPaperDTO>>>> GetAllExamPapers()
    {
        _logger.LogInformation("Fetching all Exam Papers.");
        try
        {
            var examPapers = await _examPaperService.GetAllExamPapersAsync();
            _logger.LogInformation("Successfully retrieved {Count} exam papers.", examPapers?.Count() ?? 0);

            return Ok(ApiResponse<IEnumerable<ExamPaperDTO>>.SuccessResponse(examPapers, "Exam Papers retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching exam papers.");
            return StatusCode(500, ApiResponse<IEnumerable<ExamPaperDTO>>.ErrorResponse("Internal server error."));
        }
    }

    [HttpPost("[action]")]
    public async Task<ActionResult<ApiResponse<ExamPaperDTO>>> AddExamPapers([FromBody] ExamPaperDTO dto)
    {
        _logger.LogInformation("Adding a new Exam Paper with Id {ExamPaperId}.", dto.ExamPaperId);
        try
        {
            await _examPaperService.AddExamPaperAsync(dto);
            _logger.LogInformation("Successfully added Exam Paper with ID {ExamPaperId}.", dto.ExamPaperId);
            return Ok(ApiResponse<ExamPaperDTO>.SuccessResponse(dto, "Exam Paper added successfully"));

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while adding a new Exam Paper.");
            return StatusCode(500, ApiResponse<ExamPaperDTO>.ErrorResponse("Internal server error."));
        }
    }

    [HttpPut("[action]")]
    public async Task<IActionResult> UpdateExamPaper([FromBody] ExamPaperUpdateDTO dto)
    {
        _logger.LogInformation("Updating Exam Paper with ID {ExamPaperId}.", dto.ExamPaperId);
        try
        {
            await _examPaperService.UpdateExamPaperAsync(dto);
            _logger.LogInformation("Successfully updated ExamPaper with ID {ExamPaperId}.", dto.ExamPaperId);
            return Ok(ApiResponse<ExamPaperUpdateDTO>.SuccessResponse(dto, "ExamPaper updated successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating ExamPaper with ID {ExamPaperId}.", dto.ExamPaperId);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
        }
    }

    [HttpDelete("[action]")]
    public async Task<IActionResult> DeleteExamPaper(int exampaperId)
    {
        _logger.LogInformation("Deleting ExamPaper with ID {ExamPaperId}.", exampaperId);
        try
        {
            await _examPaperService.DeleteExamPaperAsync(exampaperId);
            _logger.LogInformation("Successfully deleted Exam Paper with ID {ExamPaperId}.", exampaperId);
            return Ok(ApiResponse<object>.SuccessResponse(null, "ExamPaper deleted successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting ExamPaper with ID {ExamPaperId}.", exampaperId);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
        }
    }
}
