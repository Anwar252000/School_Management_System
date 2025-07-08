using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;


namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentParentController : ControllerBase
    {
        private readonly IStudentParent _studentParentService;
        private readonly ILogger<StudentParentController> _logger;

        public StudentParentController(ILogger<StudentParentController> logger, IStudentParent studentParent)
        {
            _logger = logger;
            _studentParentService = studentParent;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<StudentParentDTO>>> GetStudentByParentId(int parentId)
        {
            _logger.LogInformation("Fetching all Student Parent.");
            try
            {
                var students = await _studentParentService.GetStudentsByParentIdAsync(parentId);
                _logger.LogInformation("Successfully retrieved {Count} students parents .", students?.Count() ?? 0);
                return Ok(ApiResponse<IEnumerable<StudentParentDTO>>.SuccessResponse(students, "student with class retrieved successfully"
 ));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all students by parentsid.");
                return StatusCode(500, "Internal server error.");
            }
        }

    }
}
