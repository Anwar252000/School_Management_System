using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs.Library;
using SchoolManagementSystem.Application.Interfaces;

namespace SchoolManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookCategoryController : ControllerBase
    {
        private readonly IBookCategory _categoryService;
        private readonly ILogger<BookCategoryController> _logger;

        public BookCategoryController(ILogger<BookCategoryController> logger, IBookCategory categoryService)
        {
            _logger = logger;
            _categoryService = categoryService;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<BookCategoryDTO>>> GetCategory()
        {
            try
            {
                var data = await _categoryService.GetAllCategoryAsync();
                return Ok(ApiResponse<IEnumerable<BookCategoryDTO>>.SuccessResponse(data, "Categories retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving categories");
                return StatusCode(500, ApiResponse<IEnumerable<BookCategoryDTO>>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<BookCategoryDTO>>> AddCategory([FromBody] BookCategoryDTO dto)
        {
            try
            {
                await _categoryService.AddCategoryAsync(dto);
                return Ok(ApiResponse<BookCategoryDTO>.SuccessResponse(dto, "Category added successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding category");
                return StatusCode(500, ApiResponse<BookCategoryDTO>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateCategory([FromBody] BookCategoryDTO dto)
        {
            try
            {
                await _categoryService.UpdateCategoryAsync(dto);
                return Ok(ApiResponse<BookCategoryDTO>.SuccessResponse(dto, "Category updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating category");
                return StatusCode(500, ApiResponse<BookCategoryDTO>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                await _categoryService.DeleteCategoryAsync(id);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Category deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting category");
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
