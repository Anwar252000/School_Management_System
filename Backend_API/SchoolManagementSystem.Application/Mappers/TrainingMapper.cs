using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{


    public class TrainingMapper : IMapper<TrainingDTO, Training>
    {
        public Training MapToEntity(TrainingDTO dto)
        {
            return new Training
            {
                TrainingId = dto.TrainingId,
                TrainingName = dto.TrainingName,
                Certification = dto.Certification,
                TrainingDate = dto.TrainingDate,
                EmployeeId = (int)dto.EmployeeId,
                CreatedAt = dto.CreatedAt = DateTime.UtcNow,
                CreatedBy = dto.CreatedBy,
                IsActive = dto.IsActive = true
            };
        }
        public TrainingDTO MapToDto(Training entity)
        {
            return new TrainingDTO

            {
                TrainingId = entity.TrainingId,
                TrainingName = entity.TrainingName,
                Certification = entity.Certification,
                TrainingDate = entity.TrainingDate,
                EmployeeId = entity.EmployeeId,
                EmployeeName = entity.Employee.FirstName + " " + entity.Employee.LastName,
                CreatedAt = entity.CreatedAt = DateTime.UtcNow,
                CreatedBy = entity.CreatedBy,
                IsActive = entity.IsActive = true,
            };

        }

        public List<Training> MapToEntities(TrainingDTO dto)
        {
            throw new NotImplementedException();
        }

        public List<Training> MapToEntities(IEnumerable<TrainingDTO> dto)
        {
            throw new NotImplementedException();
        }
    }
}
