using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface ISponsor
    {
        Task<List<SponsorDTO>> GetAllSponsorsAsync();
        Task AddSponsorAsync(SponsorDTO dto);
        Task UpdateSponsorAsync(SponsorDTO dto);
        Task DeleteSponsorAsync(int sponsorId);

    }
}
