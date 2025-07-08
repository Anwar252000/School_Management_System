using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface ISection
    {
        Task<List<SectionDTO>> GetAllSectionAsync();
        Task<SectionDTO> GetSectionByIdAsync(int? sectionId);
        Task AddSectionAsync(SectionDTO sec);
        Task UpdateSectionAsync(SectionDTO sec);
        Task DeleteSectionAsync(int sectionId);
    }
}
