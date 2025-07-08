using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Services;
using SchoolManagementSystem.Domain.Entities;

[ApiController]
[Route("api/ExamPaperPDF")]
public class ExamPaperPDFController : ControllerBase
{
    private readonly ILogger<ExamPaperPDFController> _logger;
    private readonly IExamPaperPDF _examPaperPDFService;
    private readonly IExamPaper _examPaperService;

    public ExamPaperPDFController(ILogger<ExamPaperPDFController> logger, IExamPaperPDF examPaperPDF, IExamPaper examPaperService)
    {
        _logger = logger;
        _examPaperPDFService = examPaperPDF;
        _examPaperService = examPaperService;
    }


    [HttpGet("[action]")]
    public async Task<IActionResult> GeneratePdf(int classId, int subjectId)
    {
        _logger.LogInformation("Generating PDF for Exam Paper with ClassId {ClassId}.", classId, subjectId);

        try
        {
            var pdfBytes = await _examPaperPDFService.GeneratePdf(classId, subjectId); // Make sure the service method is async
            _logger.LogInformation("Successfully generated PDF for ClassId {ClassId}.", classId, subjectId);
            return File(pdfBytes, "application/pdf", $"ExamPaper_{classId}.pdf");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while generating PDF for ClassId {ClassId}.", classId, subjectId);
            return StatusCode(500, "Internal server error.");
        }
    }


}
