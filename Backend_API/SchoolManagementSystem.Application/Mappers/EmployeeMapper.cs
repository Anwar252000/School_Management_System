using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class EmployeeMapper : IMapper<EmployeeDTO, Employee>
    {
        public Employee MapToEntity(EmployeeDTO dto)
        {
            return new Employee
            {
                EmployeeId = dto.EmployeeId,
                RoleId = dto.RoleId,
                CampusId = dto.CampusId,
                DepartmentId = dto.DepartmentId,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                HireDate = dto.HireDate,
                Address = dto.Address,
                EmergencyContact = dto.EmergencyContact,
                Qualifications = dto.Qualifications,
                CreatedAt = dto.CreatedAt,
                CreatedBy = dto.CreatedBy,
                UpdatedAt = dto.UpdatedAt,
                UpdatedBy = dto.UpdatedBy,
                IsActive = dto.IsActive,
            };
        }

        public EmployeeDTO MapToDto(Employee entity)
        {
            return new EmployeeDTO
            {
                EmployeeId = entity.EmployeeId,
                RoleId = entity.RoleId,
                CampusId = entity.CampusId,
                DepartmentId = entity.DepartmentId,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                Email = entity.Email,
                PhoneNumber = entity.PhoneNumber,
                HireDate = entity.HireDate,
                Address = entity.Address,
                EmergencyContact = entity.EmergencyContact,
                Qualifications = entity.Qualifications,
                CreatedAt = entity.CreatedAt,
                CreatedBy = entity.CreatedBy,
                UpdatedAt = entity.UpdatedAt,
                UpdatedBy = entity.UpdatedBy,
                IsActive = entity.IsActive
            };
        }


        public EmployeeDTO MapToDtoWithSubEntity(Employee entity)
        {
            return new EmployeeDTO
            {
                EmployeeId = entity.EmployeeId,
                RoleId = entity.RoleId,
                CampusId = entity.CampusId,
                DepartmentId = entity.DepartmentId,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                Email = entity.Email,
                PhoneNumber = entity.PhoneNumber,
                HireDate = entity.HireDate,
                Address = entity.Address,
                EmergencyContact = entity.EmergencyContact,
                Qualifications = entity.Qualifications,
                CreatedAt = entity.CreatedAt,
                CreatedBy = entity.CreatedBy,
                UpdatedAt = entity.UpdatedAt,
                UpdatedBy = entity.UpdatedBy,
                IsActive = entity.IsActive,

                //EmployeeRole = entity.EmployeeRole,    // Include the full EmployeeRole object
                //Campus = entity.Campus,                // Include the full Campus object with Departments

                // Additional properties can be added if needed
                EmployeeRoleName = entity.EmployeeRole.RoleName,    // Assuming EmployeeRole has a RoleName property
                CampusName = entity.Campus.CampusName,              // Assuming Campus has a CampusName property
                DepartmentName = entity.Departments.DepartmentName
            };
        }

        public List<Employee> MapToEntities(EmployeeDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<Employee> MapToEntities(IEnumerable<EmployeeDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
