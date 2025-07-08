using Microsoft.AspNetCore.Http.HttpResults;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace SchoolManagementSystem.Application.Mappers
{
   

        public class EmployeeLeaveMapper : IMapper<EmployeeLeaveDTO, EmployeeLeave>
        {
            public EmployeeLeave MapToEntity(EmployeeLeaveDTO dto)
            {
                return new EmployeeLeave
                {
                    EmployeeLeaveId = dto.EmployeeLeaveId,
                    LeaveType = dto.LeaveType,
                    EmployeeId = dto.EmployeeId,
                    StartDate = dto.StartDate,
                    EndDate = dto.EndDate,
                    Reason = dto.Reason,
                    ApprovalStatus = dto.ApprovalStatus,
                    CreatedAt = dto.CreatedAt = DateTime.UtcNow,
                    CreatedBy = dto.CreatedBy,
                    IsActive = dto.IsActive = true
                };
            }
            public EmployeeLeaveDTO MapToDto(EmployeeLeave entity)
            {
                return new EmployeeLeaveDTO

                {
                    EmployeeLeaveId = entity.EmployeeLeaveId,
                    LeaveType = entity.LeaveType,
                    EmployeeId = entity.EmployeeId,
                    EmployeeName = entity.Employees.FirstName + " " + entity.Employees.LastName,
                    StartDate = entity.StartDate,
                    EndDate = entity.EndDate,
                    Reason = entity.Reason,
                    ApprovalStatus = entity.ApprovalStatus,
                    CreatedAt = entity.CreatedAt = DateTime.UtcNow,
                    CreatedBy = entity.CreatedBy ,
                    IsActive = entity.IsActive = true,
                };

}

        public List<EmployeeLeave> MapToEntities(EmployeeLeaveDTO dto)
        {
            throw new NotImplementedException();
        }

        public List<EmployeeLeave> MapToEntities(IEnumerable<EmployeeLeaveDTO> dto)
        {
            throw new NotImplementedException();
        }
    }
    }
