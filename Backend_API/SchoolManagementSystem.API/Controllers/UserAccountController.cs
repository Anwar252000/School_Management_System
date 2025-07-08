using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SchoolManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAccountController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IUserAccount _userAccountService;
        private readonly ILogger<UserAccountController> _logger;

        public UserAccountController(IConfiguration configuration, ILogger<UserAccountController> logger, IUserAccount userAccountService)
        {
            _configuration = configuration;
            _logger = logger;
            _userAccountService = userAccountService;
        }

        //[Authorize]
        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] UserDTO dto)
        {
            _logger.LogInformation("Adding a new User with name {userName}.", dto.UserName);
            try
            {
                await _userAccountService.AddUser(dto);
                _logger.LogInformation("Successfully added user with ID {userId}.", dto.UserId);
                return Ok(ApiResponse<UserDTO>.SuccessResponse(dto, "User {userName} added successfully"));
                //return Ok();

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new user.");
                return StatusCode(500, ApiResponse<UserDTO>.ErrorResponse("Internal server error."));
            }
        }
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAllUsers()
        {
            _logger.LogInformation("Fetcing All Users");
            try
            {
                var users = await _userAccountService.GetUsersAsync();
                _logger.LogInformation("Successfully retrieved {Count} users .", users?.Count() ?? 0);
                return Ok(ApiResponse<IEnumerable<UserDTO>>.SuccessResponse(users, "users retrieved successfully"));


            }
            catch (Exception ex)
            {

                _logger.LogError(ex, "An error occurred while fetching all user .");
                return StatusCode(500, ApiResponse<IEnumerable<UserDTO>>.ErrorResponse("Internal server error."));
            }
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<ApiResponse<UserDTO>>> Login([FromBody] LoginDTO dto)
        {
            _logger.LogInformation("Login with username {username}.", dto.UserName);
            try
            {
                var user = await _userAccountService.ValidUser(dto);
                if (user != null)
                {
                    var token = GenerateJwtToken(user);
                    user.Token = token;
                    _logger.LogInformation("Successfully Login with {username}.", dto.UserName);
                    return Ok(ApiResponse<UserDTO>.SuccessResponse(user, "Login successfully"));

                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while Login.");
                return StatusCode(500, ApiResponse<LoginDTO>.ErrorResponse("Internal server error."));
            }

            return Unauthorized();
        }



        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateUser(UserDTO dto)
        {
            _logger.LogInformation("Adding a new user  with name {userName}.", dto.UserId);
            try
            {
                await _userAccountService.UpdateUserAsync(dto);
                _logger.LogInformation("Adding a new user  with name {userName}.", dto.UserId);
                return Ok(ApiResponse<UserDTO>.SuccessResponse(dto, "user  Added successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating user  with ID {userName}.", dto.UserId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteUser(int userId)
        {

            _logger.LogInformation("Deleting user  with ID {userId}.", userId);
            try
            {
                await _userAccountService.DeleteUserAsync(userId);
                _logger.LogInformation("Successfully deleted User  with ID {userId}.", userId);
                return Ok(ApiResponse<object>.SuccessResponse(null, "User  deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting User Role with ID {userId}.", userId);
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error."));
            }

        }

        private string GenerateJwtToken(UserDTO user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Role, user.RoleName),
            new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpireMinutes"])),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }



}
