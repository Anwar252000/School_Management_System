using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentsController : ControllerBase
    {
        private readonly IDepartments _departmentService;
        private readonly ILogger<CampusesController> _logger;

        public DepartmentsController(ILogger<CampusesController> logger, IDepartments department)
        {
            _logger = logger;
            _departmentService = department;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ApiResponse<IEnumerable<DepartmentDTO>>>> GetDepartments(int departmentId)
        {
            _logger.LogInformation("Fetching all Departments.");
            try
            {
                var departments = await _departmentService.GetAllDepartmentsWithCampusAsync(departmentId);
                _logger.LogInformation("Successfully retrieved {Count} departments.", departments?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<DepartmentDTO>>.SuccessResponse(departments, "Departments retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all Campuses.");
                return StatusCode(500, ApiResponse<IEnumerable<DepartmentDTO>>.ErrorResponse("Internal server error."));
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<Department>> GetDepartmentById(int id)
        {
            _logger.LogInformation("Fetching Department with ID {DepartmentId}.", id);
            try
            {
                var campus = await _departmentService.GetDepartmentByIdAsync(id);
                if (campus == null)
                {
                    _logger.LogWarning("Department with ID {DepartmentId} not found.", id);
                    return NotFound();
                }

                _logger.LogInformation("Successfully retrieved Department with ID {DepartmentId}.", id);
                return Ok(campus);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching campus with ID {DepartmentId}.", id);
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<DepartmentDTO>>> AddDepartment([FromBody] DepartmentDTO dto)
        {
            _logger.LogInformation("Adding a new Department with name {DepartmentName}.", dto.DepartmentName);
            try
            {
                await _departmentService.AddDepartmentAsync(dto);
                _logger.LogInformation("Successfully added department with ID {DepartmentId}.", dto.DepartmentId);
                return Ok(ApiResponse<DepartmentDTO>.SuccessResponse(dto, "Department added successfully"));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new department.");
                return StatusCode(500, ApiResponse<DepartmentDTO>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateDepartment([FromBody] DepartmentDTO dto)
        {
            _logger.LogInformation("Updating Department with ID {DepartmentId}.", dto.DepartmentId);
            try
            {
                await _departmentService.UpdateDepartmentAsync(dto);
                _logger.LogInformation("Successfully updated department with ID {CampusId}.", dto.DepartmentId);
                return Ok(ApiResponse<DepartmentDTO>.SuccessResponse(dto, "Department updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating Department with ID {DepartmentId}.", dto.DepartmentId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteDepartment(int departmentId)
        {
            _logger.LogInformation("Deleting Department with ID {DepartmentId}.", departmentId);
            try
            {
                await _departmentService.DeleteDepartmentAsync(departmentId);
                _logger.LogInformation("Successfully deleted Department with ID {DepartmentId}.", departmentId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "Department deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting Department with ID {DepartmentId}.", departmentId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }
    }
}
