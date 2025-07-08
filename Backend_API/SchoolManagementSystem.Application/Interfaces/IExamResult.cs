using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IExamResult
    {
        Task<List<ExamResultDTO>> GetAllExamResultsAsync();
        Task AddExamResultAsync(ExamResultDTO examResult);
        Task UpdateExamResultAsync(ExamResultDTO examResult);
        Task DeleteExamResultAsync(int examResultId);

        Task<List<ExamResultDTO>> GetExamResultsByClassAsync(int classId);
        Task<List<ExamResultDTO>> GetExamResultsByClassTermYearExamPaperAsync(int? classId, DateTime? year, int? examPaper, string? termName);
    }
}
