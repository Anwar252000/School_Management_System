using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IExamPaperPDF
    {
        Task<byte[]> GeneratePdf(int classId, int subjectId);

    }
}
