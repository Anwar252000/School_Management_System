using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class StudentService : IStudent
    {
        private readonly IGenericRepository<Student> _studentRepository;
        private readonly StudentMapper _mapper;

        public StudentService(IGenericRepository<Student> genericRepository, StudentMapper mapper)
        {
            _studentRepository = genericRepository;
            _mapper = mapper;
        }

        public async Task AddStudentAsync(Student std)
        {
            await _studentRepository.AddAsync(std);
        }

        public async Task DeleteStudentAsync(int studentId)
        {
            try
            {
                var students = await _studentRepository.GetByIdAsync(studentId);
                if (students != null)
                {
                    students.IsActive = false;
                    await _studentRepository.UpdateAsync(students);
                }
            }
            catch (Exception)
            {

                throw;
            }

        }

        public async Task<List<Student>> GetAllStudentAsync()
        {
            return (await _studentRepository.GetAllAsync()).ToList();
        }

        public async Task<List<StudentDTO>> GetAllStudentClassWiseAsync(int? classId)
        {
            try
            {
                var result = await _studentRepository.GetAllAsync(
                    include: query => query.Include(s => s.Academic)
                                           .ThenInclude(a => a.Class)
                );

                // Get only students who are active
                var activeStudents = result.Where(s => s.IsActive).ToList();

                if (!classId.HasValue || classId == 0)
                {
                    return activeStudents.Select(s => _mapper.MapToDto(s)).ToList();
                }

                // Filter students where their academic record has the matching classId and is active
                var filteredStudents = activeStudents
                .Where(s => s.Academic != null && s.Academic.ClassId == classId && s.Academic.IsActive)
                    .Select(s => _mapper.MapToDto(s))
                     .ToList();
                return filteredStudents;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<StudentDTO>> GetAllStudentByClassAndSectionAsync(int? classId, int? sectionId)
        {
            try
            {
                var student = await _studentRepository.GetAllAsync(
                    filter: a => a.Academic.ClassId == classId || a.Academic.SectionId == sectionId && a.IsActive,
                    include: query => query
                        .Include(s => s.Academic)
                        .Include(c => c.Academic.Class)
                        .Include(sc => sc.Academic.Section)
                );
                var studentDtos = student.Select(a => _mapper.MapToDto(a)).ToList();
                return studentDtos;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while fetching attendance records.", ex);
            }
        }

        public async Task UpdateStudentAsync(Student std)
        {
            await _studentRepository.UpdateAsync(std);
        }

        public async Task UpdateStudentDataAsync(StudentDTO std)
        {
            try
            {
                var model = _mapper.MapToEntity(std);
                await _studentRepository.UpdateAsync(model);
            }
            catch (Exception)
            {

                throw;
            }

        }

        public Task<StudentDTO> GetStudentByIdAsync(int stdId)
        {
            throw new NotImplementedException();
        }

        public async Task<List<StudentDTO>> GetAllStudentsAsync()
        {
            var result = await _studentRepository.GetAllAsync(
                 include: query => query.Include(c => c.Academic.Class)
                );
            var activeStudents = result.Where(c => c.IsActive);
            var studentDtos = activeStudents.Select(c => _mapper.MapToDto(c)).ToList();
            return studentDtos;

        }
    }
}
