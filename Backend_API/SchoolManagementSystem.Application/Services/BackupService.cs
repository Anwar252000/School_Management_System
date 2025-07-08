using Microsoft.AspNetCore.Http;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class BackupService : IBackupService
    {
        private readonly string _backupDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Backups");
        private string _databaseName = "school_management_dev_sqldb";
        private readonly IGenericRepository<object> _repository;

        public BackupService(IGenericRepository<object> repository)
        {
            if (!Directory.Exists(_backupDirectory))
            {
                Directory.CreateDirectory(_backupDirectory);
            }
            _repository = repository;
        }

        public async Task<Tuple<bool, string>> CreateBackupAsync(string backupName)
        {
            try
            {
                var backupFilePath = Path.Combine(_backupDirectory, $"{backupName}_{DateTime.Now:yyyyMMddHHmmss}.bak");

                string backupSql = $@"
            BACKUP DATABASE [{_databaseName}]
            TO DISK = '{backupFilePath}'
            WITH FORMAT, INIT";

                await _repository.ExecuteRawSqlAsync(backupSql);

                return Tuple.Create(true, "Backup created successfully.");
            }
            catch (Exception ex)
            {
                return Tuple.Create(false, ex.Message);
            }
        }

        public async Task<IEnumerable<BackupResponseDto>> GetBackupsAsync()
        {
            var backups = Directory.GetFiles(_backupDirectory, "*.bak")
                .Select(file => new BackupResponseDto
                {
                    BackupId = Path.GetFileNameWithoutExtension(file).GetHashCode(),
                    BackupName = Path.GetFileNameWithoutExtension(file),
                    BackupDate = File.GetCreationTime(file)
                });

            return backups;
        }

        public async Task<Tuple<bool, string>> RestoreBackupAsync(IFormFile backupFile)
        {
            try
            {
                var backupFilePath = Path.Combine(_backupDirectory, backupFile.FileName);
                using (var stream = new FileStream(backupFilePath, FileMode.Create))
                {
                    await backupFile.CopyToAsync(stream);
                }

                string setSingleUserMode = @"
                    ALTER DATABASE [school_management_dev_sqldb] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
                    ";

                string restoreSql = $@"
                    USE master;
                    RESTORE DATABASE [{_databaseName}]
                    FROM DISK = '{backupFilePath}'
                    WITH REPLACE;
                    ALTER DATABASE [school_management_dev_sqldb] SET MULTI_USER;
                    ";

                await _repository.ExecuteRawSqlAsync(setSingleUserMode);
                await _repository.ExecuteRawSqlAsync(restoreSql);

                return Tuple.Create(true, "Backup restored successfully.");
            }
            catch (Exception ex)
            {
                return Tuple.Create(false, ex.Message);
            }
        }

        public async Task<Tuple<bool, string>> RestoreBackupAsync(string backupName)
        {
            try
            {
                var backupFilePath = Path.Combine(_backupDirectory, $"{backupName.Split(".")[0]}.bak");

                string setSingleUserMode = @"
                    ALTER DATABASE [school_management_dev_sqldb] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
                    ";

                string restoreSql = $@"
                    USE master;
                    RESTORE DATABASE [{_databaseName}]
                    FROM DISK = '{backupFilePath}'
                    WITH REPLACE;
                    ALTER DATABASE [medscribe_sqldb] SET MULTI_USER;
                    ";

                await _repository.ExecuteRawSqlAsync(setSingleUserMode);
                await _repository.ExecuteRawSqlAsync(restoreSql);

                return Tuple.Create(true, "Backup restored successfully.");
            }
            catch (Exception ex)
            {
                return Tuple.Create(false, ex.Message);
            }
        }

        public async Task<Tuple<bool, string>> DeleteBackupAsync(int backupId)
        {
            try
            {
                var backupFile = Directory.GetFiles(_backupDirectory)
                    .FirstOrDefault(file => Path.GetFileNameWithoutExtension(file).GetHashCode() == backupId);

                if (backupFile == null)
                {
                    return Tuple.Create(false, "Backup not found.");
                }

                File.Delete(backupFile);
                return Tuple.Create(true, "Backup deleted successfully.");
            }
            catch (Exception ex)
            {
                return Tuple.Create(false, ex.Message);
            }
        }

        public async Task<Tuple<bool, string, byte[]?>> DownloadBackupAsync(string backupName)
        {
            try
            {
                var backupFilePath = Path.Combine(_backupDirectory, $"{backupName.Split(".")[0]}.bak");

                if (!File.Exists(backupFilePath))
                {
                    return Tuple.Create(false, "Backup file not found.", (byte[]?)null);
                }

                byte[] fileBytes = await File.ReadAllBytesAsync(backupFilePath);

                return Tuple.Create(true, "Backup file retrieved successfully.", fileBytes);
            }
            catch (Exception ex)
            {
                return Tuple.Create(false, $"Internal server error: {ex.Message}", (byte[]?)null);
            }
        }
    }
}