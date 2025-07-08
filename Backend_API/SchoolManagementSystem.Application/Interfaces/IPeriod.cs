using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IPeriod
    {
        Task<List<PeriodDTO>> GetAllPeriodAsync();
        Task AddPeriodAsync(PeriodDTO dto);
        Task UpdatePeriodAsync(PeriodDTO dto);
        Task DeletePeriodAsync(int periodId);

    }
}
