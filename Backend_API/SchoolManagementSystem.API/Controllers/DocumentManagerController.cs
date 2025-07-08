using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;

namespace SchoolManagementSystem.API.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    public class DocumentManagerController : ControllerBase
    {
        private readonly IDocumentManager _service;
        private readonly ILogger<DocumentManagerController> _logger;


        public DocumentManagerController(ILogger<DocumentManagerController> logger, IDocumentManager service)
        {
            _logger = logger;
            _service = service;
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetAllFile()
        {
            try
            {

                var docs = await _service.GetAllDocumentsAsync();
                return Ok(ApiResponse<IEnumerable<DocumentManagerDTO>>.SuccessResponse(docs, "All Document retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all Document.");
                return StatusCode(500, ApiResponse<IEnumerable<DocumentManagerDTO>>.ErrorResponse("Internal server error."));
            }

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> UploadFile([FromForm] DocumentManagerDTO dto)
        {
            try
            {
                await _service.AddDocumentAsync(dto);
                _logger.LogInformation("Successfully upload Document with ID {DocumentManagerId}.", dto.DocumentManagerId);
                return Ok(ApiResponse<DocumentManagerDTO>.SuccessResponse(dto, "Document Uploaded successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while uploading Document.");
                return StatusCode(500, "Internal server error.");
            }

        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateDocument([FromForm] DocumentManagerDTO dto)
        {
            try
            {
                await _service.UpdateDocumentAsync(dto);
                _logger.LogInformation("Successfully updated Document with ID {DocumentManagerId}.", dto.DocumentManagerId);
                return Ok(ApiResponse<DocumentManagerDTO>.SuccessResponse(dto, "Document updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating Document with ID {DocumentManagerId}.", dto.DocumentManagerId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }

        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteDocument(int documentId)
        {
            try
            {
                await _service.DeleteDocumentAsync(documentId);
                _logger.LogInformation("Successfully deleted Document with ID {DocumentManagerId}.", documentId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Document deleted successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting Document with ID {DocumentManagerId}.", documentId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> Download(int id)
        {
            var result = await _service.DownloadDocumentAsync(id);
            if (result == null)
                return NotFound();

            return File(result.Value.FileData, result.Value.ContentType, result.Value.FileName);
        }
    }
}

