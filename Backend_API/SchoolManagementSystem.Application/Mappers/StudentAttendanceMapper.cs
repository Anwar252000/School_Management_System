using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class StudentAttendanceMapper : IMapper<StudentAttendanceDTO, StudentAttendance>
    {


        public StudentAttendance MapToEntity(StudentAttendanceDTO dto)
        {
            return new StudentAttendance
            {


                StudentId = dto.StudentId,
                //CampusId = dto.CampusId,
                ClassId = dto.ClassId,
                SectionId = dto.SectionId,
                AttendanceDate = dto.AttendanceDate,
                AttendanceStatus = dto.AttendanceStatus,
                CreatedBy = dto.CreatedBy,
                IsActive = dto.IsActive
            };
        }
        public StudentAttendanceDTO MapToDto(StudentAttendance entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            return new StudentAttendanceDTO
            {
                AttendanceId = entity.AttendanceId,
                StudentId = entity.StudentId,
                //CampusId = entity.CampusId,
                ClassId = entity.ClassId,
                SectionId = entity.SectionId,
                AttendanceDate = entity.AttendanceDate,
                AttendanceStatus = entity.AttendanceStatus,
                CreatedBy = entity.CreatedBy,
                IsActive = entity.IsActive,
                StudentName = entity.Student.FirstName + " " + entity.Student.LastName,
                GrNo = entity.Student.GrNo,
                ClassName = entity.Class.ClassName,
                SectionName = entity.Section.SectionName,
                //CampusName = entity.Campus.CampusName,



            };
        }

        public List<StudentAttendance> MapToEntities(StudentAttendanceDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<StudentAttendance> MapToEntities(IEnumerable<StudentAttendanceDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
