
using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class StudentAcademicService : IStudentAcademic
    {
        private readonly IGenericRepository<StudentAcademic> _studentAcademicRepository;
        private readonly StudentAcademicMapper _mapper;

        public StudentAcademicService(IGenericRepository<StudentAcademic> genericRepository, StudentAcademicMapper mapper)
        {
            _studentAcademicRepository = genericRepository;
            _mapper = mapper;
        }

        public async Task PromoteStudentAcademicAsync(StudentAcademicDTO dto)
        {
            try
            {
                var existingAcademicRecording = await _studentAcademicRepository.GetByIdAsync(dto.StudentAcademicId);

                if (existingAcademicRecording != null) // Ensure it's not null
                {
                    existingAcademicRecording.IsStudied = true;
                    existingAcademicRecording.IsActive = false;

                    await _studentAcademicRepository.UpdateAsync(existingAcademicRecording);
                }
                else
                {
                    throw new Exception("Student Academic record not found!");
                }

                dto.StudentAcademicId = 0; // Reset ID for new record
                var model = _mapper.MapToEntity(dto);
                await _studentAcademicRepository.AddAsync(model);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error promoting student: {ex.Message}");
            }
        }

        public async Task DeleteStudentAcademicAsync(int id)
        {
            var academic = await _studentAcademicRepository.GetByIdAsync(id);
            if (academic != null)
            {
                academic.IsActive = false;
                await _studentAcademicRepository.UpdateAsync(academic);
            }
        }

        public async Task<List<StudentAcademicDTO>> GetAllStudentAcademicAsync()
        {
            try
            {
                var academics = await _studentAcademicRepository.GetAllAsync(
                  include: query => query
                  .Include(x => x.Student)
                  .Include(x => x.Campus)
                  .Include(x => x.Class)
                  .Include(x => x.Section)
                    );
                var activeAcademics = academics.Where(c => c.IsActive);
                // Map the entities to DTOs
                var academicsDtos = activeAcademics.Select(c => _mapper.MapToDto(c)).ToList();

                return academicsDtos;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<StudentAcademicDTO> GetStudentAcademicByIdAsync(int id)
        {
            var response = await _studentAcademicRepository.GetByIdAsync(id);
            return _mapper.MapToDto(response);
        }

        public async Task UpdateStudentAcademicAsync(StudentAcademicDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _studentAcademicRepository.UpdateAsync(model);

        }

        public async Task AddStudentAcademicAsync(StudentAcademicDTO dto)
        {
            try
            {
                var model = _mapper.MapToEntity(dto);
                await _studentAcademicRepository.AddAsync(model);
            }
            catch (Exception)
            {

                throw;
            }
        }
        public async Task<StudentAcademicDTO> GetByStudentIdAsync(int studentId)
        {
            try
            {
                // Fetch student academic records with required related entities
                var academicRecord = await _studentAcademicRepository.GetAllAsync(
                    include: query => query
                        .Include(x => x.Student)
                        .Include(x => x.Campus)
                        .Include(x => x.Class)
                        .Include(x => x.Section)
                );

                // Filter by studentId and ensure it's active
                var activeAcademic = academicRecord.FirstOrDefault(c => c.StudentId == studentId && c.IsActive);

                // Return mapped DTO if record exists, otherwise return null
                return activeAcademic != null ? _mapper.MapToDto(activeAcademic) : null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<List<StudentAcademicDTO>> GetPromotedStudentByClass(int classId, string? date)
        {
            try
            {
                var academicRecords = await _studentAcademicRepository.GetAllAsync(
                    include: query => query
                        .Include(x => x.Student)
                        .Include(x => x.Campus)
                        .Include(x => x.Class)
                        .Include(x => x.Section)
                );

                // Filter by classId, academic year, and only active & promoted students
                var promotedStudents = academicRecords
                    .Where(c => c.ClassId == classId && c.AcademicYear == date && c.IsActive && c.IsPromoted);

                // Map the entities to DTOs
                var promotedStudentsDtos = promotedStudents.Select(c => _mapper.MapToDto(c)).ToList();

                return promotedStudentsDtos;
            }
            catch (Exception)
            {
                throw;
            }
        }

    }
}
