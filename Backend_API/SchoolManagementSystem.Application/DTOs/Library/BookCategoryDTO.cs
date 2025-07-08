namespace SchoolManagementSystem.Application.DTOs.Library
{
    public class BookCategoryDTO
    {
        public int BookCategoryId { get; set; }
        public string CategoryName { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public bool IsActive { get; set; }
    }
}
