using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class StudentAttendanceService : IStudentAttendance
    {
        private readonly IGenericRepository<StudentAttendance> _studentAttendanceRepository;
        private readonly StudentAttendanceMapper _mapper;

        public StudentAttendanceService(IGenericRepository<StudentAttendance> genericRepository, StudentAttendanceMapper mapper)
        {
            _studentAttendanceRepository = genericRepository;
            _mapper = mapper;
        }

        public async Task AddStudentAttendanceAsync(StudentAttendanceDTO dto)
        {
            try
            {
                var model = _mapper.MapToEntity(dto);
                object value = await _studentAttendanceRepository.AddAsync(model);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteStudentAttendanceAsync(int attendanceId)
        {
            //var studentAttendance = await _studentAttendanceRepository.GetByIdAsync(attendanceId);
            //if (studentAttendance != null)
            //{
            //    studentAttendance.IsActive = false;
            //    await _studentAttendanceRepository.UpdateAsync(studentAttendance);
            //}
            throw new NotImplementedException();
        }

        public async Task<List<StudentAttendanceDTO>> GetAllStudentsAttendanceAsync()
        {
            throw new NotImplementedException();
            //try
            //{
            //    var studentAttendance = await _studentAttendanceRepository.GetAllAsync(
            //        include: query => query
            //        .Include(s => s.Student)
            //        .Include(c => c.Class)
            //        .Include(sc => sc.Section)
            //        .Include(cp => cp.Campus)


            //        );
            //    var activeStudentAttendance = studentAttendance.Where(c => c.IsActive);
            //    var studentAttendanceDtos = activeStudentAttendance.Select(c => _mapper.MapToDto(c)).ToList();
            //    return studentAttendanceDtos;
            //}
            //catch (Exception)
            //{

            //    throw;
            //}
        }

        public async Task<List<StudentAttendanceDTO>> GetStudentAttendanceByClassSectionId(int classId, int sectionId, DateOnly attendanceDate)
        {
            try
            {
                var studentAttendance = await _studentAttendanceRepository.GetAllAsync(
                    filter: a =>
                        a.ClassId == classId &&
                        a.SectionId == sectionId &&
                        a.IsActive &&
                        (a.AttendanceDate == attendanceDate),
                    include: query => query
                        .Include(s => s.Student)
                        .Include(c => c.Class)
                        .Include(sc => sc.Section)
                );

                var studentAttendanceDtos = studentAttendance
                    .Select(a => _mapper.MapToDto(a))
                    .ToList();

                return studentAttendanceDtos;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while fetching attendance records.", ex);
            }


            //throw new NotImplementedException();
        }


        public async Task<StudentAttendanceDTO> GetStudentAttendanceByIdAsync(int stdId)
        {
            throw new NotImplementedException();
            //try
            //{
            //    var sponsorStudent = await _studentAttendanceRepository.GetAllAsync(
            //        include: query => query
            //        .Include(s => s.Student)
            //        .Include(sc => sc.Section)
            //        .Include(c => c.Class)
            //        );
            //    var studentSponsorships = sponsorStudent.Where(s => s.AttendanceId == AttendanceId).ToList();
            //    var activeSponsorStudent = studentSponsorships.Where(a => a.IsActive);
            //    var studentSponsorshipDtos = activeSponsorStudent.Select(c => _mapper.MapToDto(c)).ToList();
            //    return studentSponsorshipDtos;
            //}
            //catch (Exception)
            //{

            //    throw;
            //}
        }

        public async Task UpdateStudentAttendanceAsync(StudentAttendanceDTO dto)
        {
            //var model = _mapper.MapToEntity(dto);
            //await _studentAttendanceRepository.UpdateAsync(model);
            throw new NotImplementedException();
        }

    }
}