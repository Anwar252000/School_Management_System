using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class EmployeeAttendanceMapper : IMapper<EmployeeAttendanceDTO, EmployeeAttendance>
    {


        public EmployeeAttendance MapToEntity(EmployeeAttendanceDTO dto)
        {
            return new EmployeeAttendance
            {

                EmployeeAttendanceId = dto.EmployeeAttendanceId,
                EmployeeId = dto.EmployeeId,
                //CampusId = dto.CampusId,
                AttendanceDate = dto.AttendanceDate,
                AttendanceStatus = dto.AttendanceStatus,
                CreatedBy = dto.CreatedBy,
                IsActive = dto.IsActive
            };
        }
        public EmployeeAttendanceDTO MapToDto(EmployeeAttendance entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            return new EmployeeAttendanceDTO
            {
                EmployeeAttendanceId = entity.EmployeeAttendanceId,
                //CampusId = entity.CampusId,
                EmployeeId = entity.EmployeeId,
                AttendanceDate = entity.AttendanceDate,
                AttendanceStatus = entity.AttendanceStatus,
                CreatedBy = entity.CreatedBy,
                IsActive = entity.IsActive,
                EmployeeName = entity.Employee.FirstName + " " + entity.Employee.LastName,
                //CampusName = entity.Campus.CampusName,



            };
        }

        public List<EmployeeAttendance> MapToEntities(EmployeeAttendanceDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<EmployeeAttendance> MapToEntities(IEnumerable<EmployeeAttendanceDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
