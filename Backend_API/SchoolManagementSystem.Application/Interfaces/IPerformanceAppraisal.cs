using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IPerformanceAppraisal
    {
        Task<List<PerformanceAppraisalDTO>> GetAllPerformanceAppraisalAsync();
        //Task<PerformanceAppraisalDTO> GetPerformanceAppraisalByIdAsync(int appId);
        Task AddPerformanceAppraisalAsync(PerformanceAppraisalDTO dto);
        Task UpdatePerformanceAppraisalAsync(PerformanceAppraisalDTO dto);
        Task DeletePerformanceAppraisalAsync(int appId);


    }
}
