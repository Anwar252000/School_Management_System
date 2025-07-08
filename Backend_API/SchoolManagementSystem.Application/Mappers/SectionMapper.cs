using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class SectionMapper : IMapper<SectionDTO, Section>
    {


        public Section MapToEntity(SectionDTO dto)
        {
            return new Section
            {
                SectionId = dto.SectionId,
                SectionName = dto.SectionName,
                ClassId = dto.ClassId,
                Capacity = dto.Capacity,
                CreatedBy = dto.CreatedBy,
                UpdatedBy = dto.UpdatedBy,
            };
        }
        public SectionDTO MapToDto(Section entity)
        {
            return new SectionDTO
            {
                SectionId = entity.SectionId,
                SectionName = entity.SectionName,
                ClassId = entity.ClassId,
                Capacity = entity.Capacity,
                CreatedBy = entity.CreatedBy,
                UpdatedBy = entity.UpdatedBy,

            };
        }

        public List<Section> MapToEntities(SectionDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<Section> MapToEntities(IEnumerable<SectionDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
