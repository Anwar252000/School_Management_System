namespace SchoolManagementSystem.Application.DTOs.Library
{
    public class BookDTO
    {
        public int BookId { get; set; }
        public string Title { get; set; }
        public string? Author { get; set; }
        public string? Publisher { get; set; }
        public DateTime? PublishedDate { get; set; }
        public int? BookCategoryId { get; set; }
        public string? CategoryName { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public bool IsActive { get; set; }
    }
}
