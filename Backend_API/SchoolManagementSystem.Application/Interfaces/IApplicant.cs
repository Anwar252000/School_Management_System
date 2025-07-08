using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IApplicant
    {
        Task<List<ApplicantApplicationViewDTO>> GetAllApplicantApplicationAsync();
        Task<AdmissionApplication> GetApplicantByIdAsync(int appId);
        Task<int> AddApplicantAsync(ApplicantDTO dto);
        Task AddAdmissionApplicationAsync(ApplicationDTO dto, int id);
        Task UpdateApplicantAsync(ApplicantDTO dto);
        Task UpdateApplicationAsync(ApplicationDTO dto);
        Task DeleteApplicantAsync(int appId);
        Task ApplicationStatus(ApplicationUpdateStatusDTO dto);

    }
}
