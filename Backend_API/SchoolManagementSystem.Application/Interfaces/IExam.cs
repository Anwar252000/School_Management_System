using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IExam
    {
        Task <List<ExamDTO>> GetAllExamsAsync();
        Task AddExamAsync(ExamDTO exam);
        Task UpdateExamAsync(ExamDTO exam);
        Task DeleteExamAsync(int examId);
        Task <ExamDTO> GetByExamIdAsync(int examId);
    }
}
