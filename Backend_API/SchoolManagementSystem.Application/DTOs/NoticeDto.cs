using SchoolManagementSystem.Domain.Enums.Notice;

namespace SchoolManagementSystem.Application.DTOs
{
    public class NoticeDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int ContactBookId { get; set; } // ContactBookId will be foreign key reference to ContactBook
        public string NoticeType { get; set; } = string.Empty;
        public string RecipientType { get; set; } = string.Empty;
        public string Method { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime PublishedDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string[]? SelectedClasses { get; set; } // 
        public int[]? SelectedContacts { get; set; } // Will be replaced with contact book ids when contact book feature introduced
        public int CreatedBy { get; set; }
    }
}
