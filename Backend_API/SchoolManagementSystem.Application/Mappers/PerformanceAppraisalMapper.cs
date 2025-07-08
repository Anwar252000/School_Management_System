using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{


    public class PerformanceAppraisalMapper : IMapper<PerformanceAppraisalDTO, PerformanceAppraisal>
    {
        public PerformanceAppraisal MapToEntity(PerformanceAppraisalDTO dto)
        {
            return new PerformanceAppraisal
            {
                AppraisalId = dto.AppraisalId,
                PerformanceScore = dto.PerformanceScore,
                Comments = dto.Comments,
                AppraisalDate = dto.AppraisalDate,
                EmployeeId = dto.EmployeeId,
                CreatedAt = dto.CreatedAt = DateTime.UtcNow,
                CreatedBy = dto.CreatedBy,
                IsActive = dto.IsActive = true
            };
        }
        public PerformanceAppraisalDTO MapToDto(PerformanceAppraisal entity)
        {
            return new PerformanceAppraisalDTO

            {
                AppraisalId = entity.AppraisalId,
                PerformanceScore = entity.PerformanceScore,
                Comments = entity.Comments,
                AppraisalDate = entity.AppraisalDate,
                EmployeeId = entity.EmployeeId,
                EmployeeName = entity.Employee.FirstName + " " + entity.Employee.LastName,
                CreatedAt = entity.CreatedAt = DateTime.UtcNow,
                CreatedBy = entity.CreatedBy,
                IsActive = entity.IsActive = true,
            };

        }

        public List<PerformanceAppraisal> MapToEntities(PerformanceAppraisalDTO dto)
        {
            throw new NotImplementedException();
        }

        public List<PerformanceAppraisal> MapToEntities(IEnumerable<PerformanceAppraisalDTO> dto)
        {
            throw new NotImplementedException();
        }
    }
}
