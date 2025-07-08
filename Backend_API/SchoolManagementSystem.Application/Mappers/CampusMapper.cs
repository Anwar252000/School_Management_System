using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolManagementSystem.Application.Mappers
{
    public class CampusMapper : IMapper<CampusDTO, Campus>
    {
        public Campus MapToEntity(CampusDTO dto)
        {
            return new Campus
            {
                CampusId = dto.CampusId,
                CampusName = dto.CampusName,
                Address = dto.Address,
                Country = dto.Country,
                State = dto.State,
                City = dto.City,
                PostalCode = dto.PostalCode,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email
            };
        }

        public CampusDTO MapToDto(Campus entity)
        {
            return new CampusDTO
            {
                CampusId = entity.CampusId,
                CampusName = entity.CampusName,
                Address = entity.Address,
                Country = entity.Country, 
                State = entity.State,
                City = entity.City,
                PostalCode = entity.PostalCode,
                PhoneNumber = entity.PhoneNumber,
                Email = entity.Email
            };
        }

        public CampusDTO MapToDtoWithSubEntity(Campus entity)
        {
            return new CampusDTO
            {
                CampusId = entity.CampusId,
                CampusName = entity.CampusName,
                Address = entity.Address,
                Country = entity.Country,
                State = entity.State,
                City = entity.City,
                PostalCode = entity.PostalCode,
                PhoneNumber = entity.PhoneNumber,
                Email = entity.Email,

                // Map related entities
                Departments = entity.Departments.Select(d => new DepartmentDTO
                {
                    //CampusId = d.CampusId,
                    //Campus = d.Campus,
                    DepartmentId = d.DepartmentId,
                    DepartmentName = d.DepartmentName,
                    Description = d.Description,
                    IsActive = d.IsActive
                }).ToList(),
            };
        }

        public List<Campus> MapToEntities(CampusDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<Campus> MapToEntities(IEnumerable<CampusDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
