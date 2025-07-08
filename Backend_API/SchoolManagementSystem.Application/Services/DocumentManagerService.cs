using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class DocumentManagerService : IDocumentManager
    {
        private readonly IGenericRepository<DocumentManager> _repository;
        private readonly IWebHostEnvironment _environment;

        public DocumentManagerService(IGenericRepository<DocumentManager> repository, IWebHostEnvironment environment)
        {
            _repository = repository;
            _environment = environment;
        }

        public async Task AddDocumentAsync(DocumentManagerDTO dto)
        {
            string filePath = await SaveFileToFolder(dto.FormFile!);

            var document = new DocumentManager
            {
                DocumentTitle = dto.DocumentTitle,
                DocumentType = dto.DocumentType,
                FilePath = filePath,
                CreatedBy = dto.CreatedBy,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _repository.AddAsync(document);
        }

        public async Task UpdateDocumentAsync(DocumentManagerDTO dto)
        {
            var document = await _repository.GetByIdAsync(dto.DocumentManagerId);
            if (document == null) return;

            if (dto.FormFile != null)
            {
                var rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var fullPath = Path.Combine(rootPath, document.FilePath.TrimStart('/', '\\'));

                if (File.Exists(fullPath))
                {
                    try
                    {
                        File.Delete(fullPath);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Failed to delete file: {ex.Message}");
                    }
                }

                document.FilePath = await SaveFileToFolder(dto.FormFile);
            }

            document.DocumentTitle = dto.DocumentTitle;
            document.DocumentType = dto.DocumentType;
            document.UpdatedBy = dto.UpdatedBy;
            document.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(document);
        }

        public async Task DeleteDocumentAsync(int documentId)
        {
            var document = await _repository.GetByIdAsync(documentId);
            if (document != null)
            {
                document.IsActive = false;
                await _repository.UpdateAsync(document);
            }
        }

        public async Task<List<DocumentManagerDTO>> GetAllDocumentsAsync()
        {
            var documents = await _repository.GetAllAsync(
                include: d => d.Include(dm => dm.CreatedUser)
                    .Include(dm => dm.UpdatedUser)
                );
            return documents.Where(d => d.IsActive)
                .Select(d => new DocumentManagerDTO
                {
                    CreatedBy = d.CreatedBy,
                    UpdatedBy = d.UpdatedBy,
                    CreatedAt = d.CreatedAt,
                    UpdatedAt = d.UpdatedAt,
                    CreatedUser = d.CreatedUser?.UserName,
                    UpdatedUser = d.UpdatedUser?.UserName,
                    DocumentManagerId = d.DocumentManagerId,
                    DocumentTitle = d.DocumentTitle,
                    DocumentType = d.DocumentType,
                    FilePath = d.FilePath,
                    IsActive = d.IsActive
                }).ToList();
        }

        public async Task<(byte[] FileData, string ContentType, string FileName)?> DownloadDocumentAsync(int documentId)
        {
            var doc = await _repository.GetByIdAsync(documentId);
            if (doc != null)
            {
                var wwwRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var fullPath = Path.Combine(wwwRootPath, doc.FilePath.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));

                if (!File.Exists(fullPath))
                    return null;

                var fileData = await File.ReadAllBytesAsync(fullPath);

                // Get file extension
                var extension = Path.GetExtension(doc.FilePath)?.ToLowerInvariant();

                // Map extension to MIME type
                var contentType = extension switch
                {
                    ".pdf" => "application/pdf",
                    ".doc" => "application/msword",
                    ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    ".xls" => "application/vnd.ms-excel",
                    ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    ".txt" => "text/plain",
                    ".csv" => "text/csv",
                    _ => "application/octet-stream" // fallback
                };

                var sanitizedTitle = string.Join("_", doc.DocumentTitle.Split(Path.GetInvalidFileNameChars()));
                var fileName = $"{sanitizedTitle}{extension}";
                return (fileData, contentType, fileName);
            }

            return null;
        }



        private async Task<string> SaveFileToFolder(IFormFile file)
        {
            // Determine full upload folder path
            var webRoot = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var folderPath = Path.Combine(webRoot, "uploads");
            Directory.CreateDirectory(folderPath);

            // Create unique file name and full file path
            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var fullFilePath = Path.Combine(folderPath, fileName);

            // Save file to disk
            using (var stream = new FileStream(fullFilePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Return only the relative path for storage
            return $"/uploads/{fileName}";
        }

    }
}