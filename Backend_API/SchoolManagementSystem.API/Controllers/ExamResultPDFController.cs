using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Services;
using SchoolManagementSystem.Domain.Entities;

[ApiController]
[Route("api/ExamResultPDF")]
public class ExamResultPDFController : ControllerBase
{
    private readonly ILogger<ExamResultPDFController> _logger;
    private readonly IExamResultPDF _examResultPDFService;
    private readonly IExamResult _examResultService;

    public ExamResultPDFController(ILogger<ExamResultPDFController> logger, IExamResultPDF examResultPDF, IExamResult examResultService)
    {
        _logger = logger;
        _examResultPDFService = examResultPDF;
        _examResultService = examResultService;
    }


    [HttpGet("[action]")]
    public async Task<IActionResult> GeneratePdf(int studentId)
    {
        _logger.LogInformation("Generating PDF for Exam Result with StudentId {StudentId}.", studentId);

        try
        {
            var pdfBytes = await _examResultPDFService.GeneratePdf(studentId); // Make sure the service method is async
            _logger.LogInformation("Successfully generated PDF for StudentId {StudentId}.", studentId);
            return File(pdfBytes, "application/pdf", $"ExamPaper_{studentId}.pdf");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while generating PDF for StudentId {StudentId}.", studentId);
            return StatusCode(500, "Internal server error.");
        }
    }


}
