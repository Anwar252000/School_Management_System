using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SchoolManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WarmupController : ControllerBase
    {
        [HttpGet]
        public IActionResult Test()
        {
            return Ok("Web API is up and running.");
        }
    }
}
