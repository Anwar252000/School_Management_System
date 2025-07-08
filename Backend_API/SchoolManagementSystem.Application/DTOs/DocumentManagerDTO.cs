using Microsoft.AspNetCore.Http;

namespace SchoolManagementSystem.Application.DTOs
{
    public class DocumentManagerDTO
    {
        public int DocumentManagerId { get; set; }
        public string? DocumentTitle { get; set; }
        public string? FilePath { get; set; }
        public string? DocumentType { get; set; }
        public IFormFile? FormFile { get; set; }
        public int? CreatedBy { get; set; }
        public string? CreatedUser { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public string? UpdatedUser { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsActive { get; set; }

    }
}
