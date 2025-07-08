namespace SchoolManagementSystem.Application.DTOs
{
    public class ApplicationUpdateStatusDTO
    {
        public int ApplicationId { get; set; }
        public int SectionId { get; set; }

        public int? ApplicantId { get; set; }

        public string ApplicationStatus { get; set; }
    }
}
