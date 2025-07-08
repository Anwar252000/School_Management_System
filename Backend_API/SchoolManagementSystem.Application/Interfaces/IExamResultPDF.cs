
namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IExamResultPDF
    {
        Task<byte[]> GeneratePdf(int studentId);
    }
}
