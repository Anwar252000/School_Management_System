using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IDashboardCountView
    {
        Task<DashboardCountViewDTO> GetDasboardCountViewAsync();


    }
}
