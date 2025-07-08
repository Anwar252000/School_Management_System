using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;

[ApiController]
[Route("api/Payment")]
public class PaymentController : ControllerBase
{
    private readonly ILogger<PaymentController> _logger;
    private readonly IPayment _paymentService;

    public PaymentController(ILogger<PaymentController> logger, IPayment paymentService)
    {
        _logger = logger;
        _paymentService = paymentService;
    }


    [HttpGet("[action]")]
    public async Task<ActionResult<ApiResponse<IEnumerable<PaymentDTO>>>> GetAllPayments()
    {
        _logger.LogInformation("Fetching all payments.");
        try
        {
            var payments = await _paymentService.GetAllPaymentAsync();
            _logger.LogInformation("Successfully retrieved {Count} payment.", payments?.Count() ?? 0);

            return Ok(ApiResponse<IEnumerable<PaymentDTO>>.SuccessResponse(payments, "payments retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching all payment.");
            return StatusCode(500, ApiResponse<IEnumerable<PaymentDTO>>.ErrorResponse("Internal server error."));
        }
    }

    [HttpPost("[action]")]
    public async Task<ActionResult<ApiResponse<PaymentDTO>>> AddPayment([FromBody] PaymentDTO dto)
    {
        _logger.LogInformation("Adding a new Payment with name {PaymentId}.", dto.PaymentId);
        try
        {
            await _paymentService.AddPaymentAsync(dto);
            _logger.LogInformation("Successfully added payment with ID {PaymentId}.", dto.PaymentId);
            return Ok(ApiResponse<PaymentDTO>.SuccessResponse(dto, "Payment added successfully"));

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while adding a new Payment.");
            return StatusCode(500, ApiResponse<PaymentDTO>.ErrorResponse("Internal server error."));
        }
    }

    [HttpPut("[action]")]
    public async Task<IActionResult> UpdatePayment([FromBody] PaymentDTO dto)
    {
        _logger.LogInformation("Updating Payment with ID {PaymentId}.", dto.PaymentId);
        try
        {
            await _paymentService.UpdatePaymentAsync(dto);
            _logger.LogInformation("Successfully updated Payment with ID {PaymentId}.", dto.PaymentId);
            return Ok(ApiResponse<PaymentDTO>.SuccessResponse(dto, "Payment updated successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating Payment with ID {PaymentId}.", dto.PaymentId);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
        }
    }

    [HttpDelete("[action]")]
    public async Task<IActionResult> DeletePayment(int paymentId)
    {
        _logger.LogInformation("Deleting payment with ID {paymentId}.", paymentId);
        try
        {
            await _paymentService.DeletePaymentAsync(paymentId);
            _logger.LogInformation("Successfully deleted payment with ID {PaymentId}.", paymentId);
            return Ok(ApiResponse<object>.SuccessResponse(null, "payment deleted successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting payment with ID {PaymentId}.", paymentId);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
        }
    }
}
