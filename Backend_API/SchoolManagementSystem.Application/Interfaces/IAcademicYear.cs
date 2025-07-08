using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IAcademicYear
    {
        Task<List<AcademicYearDTO>> GetAllAcademicYearAsync();
        Task<AcademicYearDTO> GetAcademicYearByIdAsync(int id);
        Task AddAcademicYearAsync(AcademicYearDTO dto);
        Task<List<AcademicYearDTO>> GetAcademicYearByYear(string? academicYear);
        Task UpdateAcademicYearAsync(AcademicYearDTO dto);
        Task DeleteAcademicYearAsync(int id);
    }
}
