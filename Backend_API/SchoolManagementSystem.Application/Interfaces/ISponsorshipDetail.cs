using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface ISponsorshipDetail
    {
        Task<List<SponsorshipDetailDTO>> GetAllSponsorshipsDetailAsync();
        Task AddSponsorshipDetailAsync(SponsorshipDetailDTO dto);
        //Task<SponsorshipDetailDTO> GetSponsorshipByIdAsync(int sponsorshipId);
        //Task UpdateSponsorshipAsync(SponsorshipDTO dto);
        //Task DeleteSponsorshipAsync(int sponsorshipId);

        //Task<List<SponsorshipDTO>> GetAllStudentBySponsorIdAsync(int sponsorId);

    }
}
