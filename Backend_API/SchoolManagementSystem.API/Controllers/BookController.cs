using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs.Library;
using SchoolManagementSystem.Application.Interfaces;

namespace SchoolManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IBook _bookService;
        private readonly ILogger<BookController> _logger;

        public BookController(ILogger<BookController> logger, IBook bookService)
        {
            _logger = logger;
            _bookService = bookService;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<BookDTO>>> GetBook()
        {
            try
            {
                var data = await _bookService.GetAllBookAsync();
                return Ok(ApiResponse<IEnumerable<BookDTO>>.SuccessResponse(data, "Books retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving books");
                return StatusCode(500, ApiResponse<IEnumerable<BookDTO>>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<BookDTO>>> AddBook([FromBody] BookDTO dto)
        {
            try
            {
                await _bookService.AddBookAsync(dto);
                return Ok(ApiResponse<BookDTO>.SuccessResponse(dto, "Book added successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding book");
                return StatusCode(500, ApiResponse<BookDTO>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateBook([FromBody] BookDTO dto)
        {
            try
            {
                await _bookService.UpdateBookAsync(dto);
                return Ok(ApiResponse<BookDTO>.SuccessResponse(dto, "Book updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating book");
                return StatusCode(500, ApiResponse<BookDTO>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            try
            {
                await _bookService.DeleteBookAsync(id);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Book deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting book");
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
