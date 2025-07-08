using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeeVoucherController : ControllerBase
    {
        private readonly IFeeVoucher _feeVoucher;
        private readonly ILogger<FeeVoucherController> _logger;

        public FeeVoucherController(ILogger<FeeVoucherController> logger, IFeeVoucher feeVoucher)
        {
            _logger = logger;
            _feeVoucher = feeVoucher;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ApiResponse<IEnumerable<FeeVoucherDTO>>>> GetFeeVouchers()
        {
            _logger.LogInformation("Fetching all Fee Vouchers.");
            try
            {
                var FeeVoucher = await _feeVoucher.GetAllFeeVouchersAsync();
                _logger.LogInformation("Successfully retrieved {Count} FeeVouchers.", FeeVoucher?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<FeeVoucherDTO>>.SuccessResponse(FeeVoucher, "Fee Voucher retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all Fee Voucher.");
                return StatusCode(500, ApiResponse<IEnumerable<FeeVoucherDTO>>.ErrorResponse("Internal server error."));
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<FeeVoucherDTO>> GetFeeVoucherById(int feeVoucherId)
        {
            _logger.LogInformation("Fetching Fee Voucher with ID {FeeVoucherId}.", feeVoucherId);
            try
            {
                var feeVoucher = await _feeVoucher.GetFeeVoucherByIdAsync(feeVoucherId);
                if (feeVoucher == null)
                {
                    _logger.LogWarning("Fee Voucher with ID {FeeVoucherId} not found.", feeVoucher);
                    return NotFound();
                }

                _logger.LogInformation("Successfully retrieved Fee Voucher with ID {FeeVoucherId}.", feeVoucher);
                return Ok(feeVoucher);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching Fee Voucher with ID {FeeVoucherId}.", feeVoucherId);
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<FeeVoucherDTO>>> AddFeeVoucher([FromBody] FeeVoucherDTO dto)
        {
            _logger.LogInformation("Adding a new Fee Voucher with {Fee}.", dto.TotalAmount);
            try
            {
                await _feeVoucher.AddFeeVoucherAsync(dto);
                _logger.LogInformation("Successfully added Fee Voucher with ID {FeeVoucherId}.", dto.VoucherId);
                return Ok(ApiResponse<FeeVoucherDTO>.SuccessResponse(dto, "Fee Voucher added successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new Fee Voucher.");
                return StatusCode(500, ApiResponse<FeeVoucherDTO>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateFeeVoucher([FromBody] FeeVoucherDTO dto)
        {
            _logger.LogInformation("Updating Fee Voucher with ID {FeeVoucherId}.", dto.VoucherId);
            try
            {
                await _feeVoucher.UpdateFeeVoucherAsync(dto);
                _logger.LogInformation("Successfully updated Fee Voucher with ID {FeeVoucherId}.", dto.VoucherId);
                return Ok(ApiResponse<FeeVoucherDTO>.SuccessResponse(dto, "Fee Voucher updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating Fee Voucher with ID {FeeVoucherId}.", dto.VoucherId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteFeeVoucher(int feeVoucherId)
        {
            _logger.LogInformation("Deleting Fee Voucher with ID {FeeVoucherId}.", feeVoucherId);
            try
            {
                await _feeVoucher.DeleteFeeVoucherAsync(feeVoucherId);
                _logger.LogInformation("Successfully deleted Fee Voucher with ID {feeVoucherId}.", feeVoucherId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Fee Voucher deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting Fee Voucher with ID {feeVoucherId}.", feeVoucherId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
