using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class ClassMapper : IMapper<ClassDto, Class>
    {


        public Class MapToEntity(ClassDto dto)
        {
            return new Class
            {
                ClassId = dto.ClassId,
                ClassName = dto.ClassName,
                ClassDescription = dto.ClassDescription,
                Capacity = dto.Capacity,
                CreatedBy = dto.CreatedBy,
                UpdatedBy = dto.UpdatedBy,
            };
        }
        public ClassDto MapToDto(Class entity)
        {
            return new ClassDto
            {
                ClassId = entity.ClassId,
                ClassName = entity.ClassName,
                ClassDescription = entity.ClassDescription,
                Capacity = entity.Capacity,
                CreatedBy = entity.CreatedBy,
                UpdatedBy = entity.UpdatedBy,

            };
        }

        public List<Class> MapToEntities(ClassDto dto)
        {
            throw new NotImplementedException();
        }

		public List<Class> MapToEntities(IEnumerable<ClassDto> dto)
		{
			throw new NotImplementedException();
		}
	}
}
