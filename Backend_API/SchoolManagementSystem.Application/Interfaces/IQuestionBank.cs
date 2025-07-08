using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IQuestionBank
    {
        Task<List<QuestionBankDto>> GetAllQuestionsAsync();
        Task AddQuestionsAsync(QuestionBankDto dto);
        Task UpdateQuestionAsync(QuestionBankDto dto);
        Task DeleteQuestionAsync(int questionId);

    }
}
