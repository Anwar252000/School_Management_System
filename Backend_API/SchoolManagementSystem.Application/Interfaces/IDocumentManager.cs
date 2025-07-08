using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IDocumentManager
    {
        Task<List<DocumentManagerDTO>> GetAllDocumentsAsync();
        Task AddDocumentAsync(DocumentManagerDTO dto);
        Task UpdateDocumentAsync(DocumentManagerDTO dto);
        Task DeleteDocumentAsync(int documentId);
        Task<(byte[] FileData, string ContentType, string FileName)?> DownloadDocumentAsync(int documentId);
    }
}