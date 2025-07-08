using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class ClassroomMapper : IMapper<ClassroomDTO, Classroom>
    {
        public Classroom MapToEntity(ClassroomDTO dto)
        {
            return new Classroom
            {
                ClassroomId = dto.ClassroomId,
                CampusId = dto.CampusId,
                RoomNumber = dto.RoomNumber,
                Building = dto.Building,
                Capacity = dto.Capacity,
                IsActive = dto.IsActive,

            };
        }
        public ClassroomDTO MapToDto(Classroom entity)
        {
            return new ClassroomDTO
            {
                ClassroomId = entity.ClassroomId,
                CampusId = entity.CampusId,
                RoomNumber = entity.RoomNumber,
                Building = entity.Building,
                Capacity = entity.Capacity,
                IsActive = entity.IsActive,
            };
        }

        public List<Classroom> MapToEntities(ClassroomDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<Classroom> MapToEntities(IEnumerable<ClassroomDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
