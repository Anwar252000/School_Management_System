using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;

[ApiController]
[Route("api/Questions")]
public class QBankController : ControllerBase
{
    private readonly ILogger<QBankController> _logger;
    private readonly IQuestionBank _qbankService;

    public QBankController(ILogger<QBankController> logger, IQuestionBank qbankService)
    {
        _logger = logger;
        _qbankService = qbankService;
    }

    [HttpGet("[action]")]
    public async Task<ActionResult<ApiResponse<IEnumerable<QuestionBankDto>>>> GetAllQuestions()
    {
        _logger.LogInformation("Fetching all Questions.");
        try
        {
            var questions = await _qbankService.GetAllQuestionsAsync();
            _logger.LogInformation("Successfully retrieved {Count} questions.", questions?.Count() ?? 0);

            return Ok(ApiResponse<IEnumerable<QuestionBankDto>>.SuccessResponse(questions, "Questions retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching questions.");
            return StatusCode(500, ApiResponse<IEnumerable<QuestionBankDto>>.ErrorResponse("Internal server error."));
        }
    }

    [HttpPost("[action]")]
    public async Task<ActionResult<ApiResponse<QuestionBankDto>>> AddQuestions([FromBody] QuestionBankDto dto)
    {
        _logger.LogInformation("Adding a new Question with name {QuestionType}.", dto.QuestionType);
        try
        {
            await _qbankService.AddQuestionsAsync(dto);
            _logger.LogInformation("Successfully added Question with ID {QuestionBankId}.", dto.QuestionBankId);
            return Ok(ApiResponse<QuestionBankDto>.SuccessResponse(dto, "Question added successfully"));

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while adding a new Question.");
            return StatusCode(500, ApiResponse<QuestionBankDto>.ErrorResponse("Internal server error."));
        }
    }

    [HttpPut("[action]")]
    public async Task<IActionResult> UpdateQuestion([FromBody] QuestionBankDto dto)
    {
        _logger.LogInformation("Updating Question with ID {QuestionBankId}.", dto.QuestionBankId);
        try
        {
            await _qbankService.UpdateQuestionAsync(dto);
            _logger.LogInformation("Successfully updated Question with ID {QuestionBankId}.", dto.QuestionBankId);
            return Ok(ApiResponse<QuestionBankDto>.SuccessResponse(dto, "Question updated successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating Question with ID {QuestionBankId}.", dto.QuestionBankId);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
        }
    }

    [HttpDelete("[action]")]
    public async Task<IActionResult> DeleteQuestion(int questionId)
    {
        _logger.LogInformation("Deleting Question with ID {QuestionId}.", questionId);
        try
        {
            await _qbankService.DeleteQuestionAsync(questionId);
            _logger.LogInformation("Successfully deleted Question with ID {QuestionId}.", questionId);
            return Ok(ApiResponse<object>.SuccessResponse(null, "Question deleted successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting Question with ID {QuestionId}.", questionId);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
        }
    }
}
