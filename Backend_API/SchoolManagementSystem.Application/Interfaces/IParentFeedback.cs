using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IParentFeedback
    {
        Task<List<ParentFeedbackDTO>> GetAllParentFeedbackAsync();
        Task AddParentFeedbackAsync(ParentFeedbackDTO dto);
        Task UpdateParentFeedbackAsync(ParentFeedbackDTO dto);
        Task DeleteParentFeedbackAsync(int parentFeedbackId);

    }
}
