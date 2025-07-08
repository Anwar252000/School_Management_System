using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolManagementSystem.Application.Mappers
{
    public class DepartmentMapper : IMapper<DepartmentDTO, Department>
    {
        public DepartmentDTO MapToDto(Department entity)
        {
            return new DepartmentDTO
            {
                DepartmentId = entity.DepartmentId,
                CampusId = entity.CampusId,
                DepartmentName = entity.DepartmentName,
                Description = entity.Description,
                IsActive = entity.IsActive,
                Campus = entity.Campus,
            };
        }

        public List<Department> MapToEntities(DepartmentDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<Department> MapToEntities(IEnumerable<DepartmentDTO> dto)
		{
			throw new NotImplementedException();
		}

		public Department MapToEntity(DepartmentDTO dto)
        {
            return new Department
            {
                DepartmentId = dto.DepartmentId,
                CampusId = dto.CampusId,
                DepartmentName = dto.DepartmentName,
                Description = dto.Description,
                IsActive = dto.IsActive,
                Campus = dto.Campus,
            };
        }


    }
}
