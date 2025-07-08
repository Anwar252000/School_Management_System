using Microsoft.AspNetCore.Http;

using SchoolManagementSystem.Application.DTOs;



namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IBackupService
    {
        Task<Tuple<bool, string>> CreateBackupAsync(string backupName);
        Task<IEnumerable<BackupResponseDto>> GetBackupsAsync();
        Task<Tuple<bool, string>> RestoreBackupAsync(IFormFile backupFile);
        Task<Tuple<bool, string>> RestoreBackupAsync(string backupName);
        Task<Tuple<bool, string>> DeleteBackupAsync(int backupId);
        Task<Tuple<bool, string, byte[]?>> DownloadBackupAsync(string backupName);
    }
}