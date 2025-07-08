using SchoolManagementSystem.Domain.Enums.Notice;

namespace SchoolManagementSystem.Domain.Entities
{
    public class Notice
	{
        public int NoticeId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty; 
		//public int ContactBookId { get; set; } // ContactBookId will be foreign key reference to ContactBook
        public NoticeType NoticeType { get; set; }
		public RecipientType RecipientType { get; set; }
		public Method Method { get; set; }
		public Status Status { get; set; }
		public DateTime PublishedDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public int CreatedBy { get; set; }
    }
}
