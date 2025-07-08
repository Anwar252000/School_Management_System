using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;

[ApiController]
[Route("api/[controller]")]
public class BackupsController : ControllerBase
{
    private readonly IBackupService _backupService;

    public BackupsController(IBackupService backupService)
    {
        _backupService = backupService;
    }

    [HttpPost("CreateBackup")]
    public async Task<ActionResult<ApiResponse<object>>> CreateBackup(string backupName)
    {
        var result = await _backupService.CreateBackupAsync(backupName);
        if (result.Item1)
        {
            return Ok(ApiResponse<object>.SuccessResponse(new(), result.Item2));
        }

        return BadRequest(result.Item2);
    }

    [HttpGet("GetBackups")]
    public async Task<ActionResult<ApiResponse<IEnumerable<BackupResponseDto>>>> GetBackups()
    {
        var backups = await _backupService.GetBackupsAsync();
        return Ok(ApiResponse<IEnumerable<BackupResponseDto>>.SuccessResponse(backups, "Backups retreived successfully"));
    }

    [HttpPost("RestoreBackup")]
    public async Task<ActionResult<ApiResponse<object>>> RestoreBackup(string backupName)
    {
        var result = await _backupService.RestoreBackupAsync(backupName);
        if (result.Item1)
        {
            return Ok(ApiResponse<object>.SuccessResponse(new(), result.Item2));
        }

        return BadRequest(result.Item2);
    }

    [HttpPost("RestoreBackupFromFile")]
    public async Task<ActionResult<ApiResponse<object>>> RestoreBackupFromFile(IFormFile file)
    {
        var result = await _backupService.RestoreBackupAsync(file);
        if (result.Item1)
        {
            return Ok(ApiResponse<object>.SuccessResponse(new(), result.Item2));
        }

        return BadRequest(result.Item2);
    }

    [HttpDelete("DeleteBackup")]
    public async Task<IActionResult> DeleteBackup(int id)
    {
        var result = await _backupService.DeleteBackupAsync(id);
        if (result.Item1)
        {
            return NoContent();
        }

        return NotFound(ApiResponse<object>.ErrorResponse(result.Item2));
    }

    [HttpPost("DownloadBackup")]
    public async Task<ActionResult> DownloadBackup(string backupName)
    {
        var result = await _backupService.DownloadBackupAsync(backupName);

        if (!result.Item1)


        {
            return NotFound(result.Item2);
        }

        var fileBytes = result.Item3;
        return fileBytes != null ? File(fileBytes, "application/octet-stream", backupName) : StatusCode(500, "Internal Server Error");
    }
}