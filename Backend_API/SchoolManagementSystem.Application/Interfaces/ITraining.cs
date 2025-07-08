using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface ITraining
    {
        Task<List<TrainingDTO>> GetAllTrainingAsync();
        //Task<PerformanceAppraisalDTO> GetPerformanceAppraisalByIdAsync(int appId);
        Task AddTrainingAsync(TrainingDTO dto);
        Task UpdateTrainingAsync(TrainingDTO dto);
        Task DeleteTrainingAsync(int trainingId);


    }
}
