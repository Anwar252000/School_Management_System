using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs.Library;
using SchoolManagementSystem.Application.Interfaces;

namespace SchoolManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookPurchaseController : ControllerBase
    {
        private readonly IBookPurchase _purchaseService;
        private readonly ILogger<BookPurchaseController> _logger;

        public BookPurchaseController(ILogger<BookPurchaseController> logger, IBookPurchase purchase)
        {
            _logger = logger;
            _purchaseService = purchase;
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetPurchase()
        {
            try
            {
                var data = await _purchaseService.GetAllPurchaseAsync();
                return Ok(ApiResponse<IEnumerable<BookPurchaseDTO>>.SuccessResponse(data, "Purchase records retrieved"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving purchase records");
                return StatusCode(500, ApiResponse<IEnumerable<BookPurchaseDTO>>.ErrorResponse("Internal Server Error"));
            }
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddPurchase([FromBody] BookPurchaseDTO dto)
        {
            try
            {
                await _purchaseService.AddPurchaseAsync(dto);
                return Ok(ApiResponse<BookPurchaseDTO>.SuccessResponse(dto, "Purchase added successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding purchase");
                return StatusCode(500, ApiResponse<BookPurchaseDTO>.ErrorResponse("Internal Server Error"));
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdatePurchase(BookPurchaseDTO dto)
        {
            try
            {
                await _purchaseService.UpdatePurchaseAsync(dto);
                return Ok(ApiResponse<BookPurchaseDTO>.SuccessResponse(dto, "Purchase updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating purchase");
                return StatusCode(500, ApiResponse<BookPurchaseDTO>.ErrorResponse("Internal Server Error"));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeletePurchase(int id)
        {
            try
            {
                await _purchaseService.DeletePurchaseAsync(id);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Purchase deleted"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting purchase");
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal Server Error"));
            }
        }
    }
}
