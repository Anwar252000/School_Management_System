
namespace SchoolManagementSystem.Application.DTOs
{
    public class ExamDetailsResultDTO
    {
        public int ExamResultId { get; set; }
        public int? ExamPaperId { get; set; }
        public int? StudentId { get; set; }
        public int? MarksObtained { get; set; }
    }
}
