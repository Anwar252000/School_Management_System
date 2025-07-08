using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class AcademicYearService : IAcademicYear
    {
        private readonly IGenericRepository<AcademicYear> _academicYearRepository;
        private readonly AcademicYearMapper _mapper;

        public AcademicYearService(IGenericRepository<AcademicYear> academicYearRepository, AcademicYearMapper mapper)
        {
            _academicYearRepository = academicYearRepository;
            _mapper = mapper;
        }

        public async Task<List<AcademicYearDTO>> GetAllAcademicYearAsync()
        {
            try
            {
                // Fetch all academic years including related entities (if necessary)
                var academicYears = await _academicYearRepository.GetAllAsync(
                    include: query => query
                        .Include(x => x.Student) // Example, if needed
                        .Include(x => x.CreatedUser) // For CreatedBy user name, etc.
                        .Include(x => x.UpdatedUser) // For UpdatedBy user name, etc.
                );

                // Map the entities to DTOs
                var academicYearDtos = academicYears.Select(a => _mapper.MapToDto(a)).ToList();
                return academicYearDtos;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error fetching all academic years: {ex.Message}");
            }
        }

        public async Task<AcademicYearDTO> GetAcademicYearByIdAsync(int id)
        {
            try
            {
                var academicYear = await _academicYearRepository.GetByIdAsync(id);
                if (academicYear == null)
                {
                    throw new Exception("Academic Year not found.");
                }

                // Map the entity to DTO
                var academicYearDto = _mapper.MapToDto(academicYear);
                return academicYearDto;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error fetching academic year with ID {id}: {ex.Message}");
            }
        }

        public async Task AddAcademicYearAsync(AcademicYearDTO dto)
        {
            try
            {
                var academicYearEntity = _mapper.MapToEntity(dto);
                await _academicYearRepository.AddAsync(academicYearEntity);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error adding academic year: {ex.Message}");
            }
        }

        public async Task<List<AcademicYearDTO>> GetAcademicYearByYear(string? academicYear)
        {
            try
            {
                // Fetch all academic years with the given academic year
                var academicYears = await _academicYearRepository.GetAllAsync();

                var academic = academicYears.Where(a => a.AcademicYearName == academicYear && a.IsActive);

                // Map the entities to DTOs
                var academicYearDtos = academic.Select(a => _mapper.MapToDto(a)).ToList();
                return academicYearDtos;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error fetching academic years for the year {academicYear}: {ex.Message}");
            }
        }

        public async Task UpdateAcademicYearAsync(AcademicYearDTO dto)
        {
            try
            {
                var academicYearEntity = _mapper.MapToEntity(dto);
                await _academicYearRepository.UpdateAsync(academicYearEntity);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating academic year: {ex.Message}");
            }
        }

        public async Task DeleteAcademicYearAsync(int id)
        {
            try
            {
                var academicYear = await _academicYearRepository.GetByIdAsync(id);
                if (academicYear != null)
                {
                    academicYear.IsActive = false;
                    await _academicYearRepository.UpdateAsync(academicYear);
                }
                else
                {
                    throw new Exception("Academic Year not found.");
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting academic year: {ex.Message}");
            }
        }
    }
}
