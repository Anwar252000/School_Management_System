using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;
using System.Data;

namespace SchoolManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeLeaveController : ControllerBase
    {
        private readonly IEmployeeLeave _employeeleaveService;
        private readonly ILogger<EmployeeLeaveController> _logger;
        public EmployeeLeaveController(ILogger<EmployeeLeaveController> logger, IEmployeeLeave employeeleave)
        {
            _logger = logger;
            _employeeleaveService = employeeleave;
        }

        [HttpGet("[action]")]

        public async Task<ActionResult<IEnumerable<EmployeeLeaveDTO>>> GetEmployeeLeave()
        {
            _logger.LogInformation("Fetching all Employee Leaves.");
            try
            {
                var employeeleave = await _employeeleaveService.GetAllEmployeeLeaveAsync();
                _logger.LogInformation("Successfully retrieved {Count} employeleave.", employeeleave?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<EmployeeLeaveDTO>>.SuccessResponse(employeeleave, "employeeleave retrieved successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all employeeleave.");
                return StatusCode(500, ApiResponse<IEnumerable<EmployeeLeaveDTO>>.ErrorResponse("Internal server error."));

            }
        }

        [HttpPost("[action]")]

        public async Task<ActionResult<ApiResponse<EmployeeLeaveDTO>>> AddEmployeeLeave([FromBody] EmployeeLeaveDTO dto)
        {
            _logger.LogInformation("Adding a new employeeleave" +
                " with name {EmployeeLeaveName}.", dto.EmployeeName);
            try
            {
                await _employeeleaveService.AddEmployeeLeaveAsync(dto);
                _logger.LogInformation("Adding a new employeeleave with name {employeleaveName}.", dto.EmployeeName);
                return Ok(ApiResponse<EmployeeLeaveDTO>.SuccessResponse(dto, "employeeleave Added successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new employeeleave.");
                return StatusCode(500, "Internal server error.");
            }
        }



        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateEmployeeLeave(EmployeeLeaveDTO employeeleave)
        {

            _logger.LogInformation("Adding a new employeeleave with name {employeeleaveName}.", employeeleave.EmployeeName);
            try
            {
                await _employeeleaveService.UpdateEmployeeLeaveAsync(employeeleave);
                _logger.LogInformation("Adding a new role with name {leaveName}.", employeeleave.EmployeeName);
                return Ok(ApiResponse<EmployeeLeaveDTO>.SuccessResponse(employeeleave, "leave updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating role with ID {leaveId}.", employeeleave.EmployeeLeaveId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteEmployeeLeave(int employeeleaveId)
        {

            _logger.LogInformation("Deleting role with ID {EmployeeLeaveId}.", employeeleaveId);
            try
            {
                await _employeeleaveService.DeleteEmployeeLeaveAsync(employeeleaveId);
                _logger.LogInformation("Successfully deleted EmployeLeave with ID {leaveId}.", employeeleaveId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Employee Leave Rejected successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting Role with ID {roleId}.", employeeleaveId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }

        }

    }

}