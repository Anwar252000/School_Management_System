using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Entities.Fee;

namespace SchoolManagementSystem.Application.Mappers
{
    public class FeeCategoryMapper : IMapper<FeeCategoryDTO, FeeCategory>
    {
        public FeeCategoryDTO MapToDto(FeeCategory entity)
        {
            return new FeeCategoryDTO
            {
                FeeCategoryId = entity.FeeCategoryId,
                FeeName = entity.FeeName,
                FeeDescription = entity.FeeDescription,
                IsActive = entity.IsActive,
                CreatedBy = entity.CreatedBy,
            };
        }

        public List<FeeCategory> MapToEntities(IEnumerable<FeeCategoryDTO> dto)
        {
            throw new NotImplementedException();
        }

        public List<FeeCategory> MapToEntities(FeeCategoryDTO dto)
        {
            throw new NotImplementedException();
        }

        public FeeCategory MapToEntity(FeeCategoryDTO dto)
        {
            return new FeeCategory
            {
                FeeCategoryId = dto.FeeCategoryId,
                FeeName = dto.FeeName,
                FeeDescription = dto.FeeDescription,
                IsActive = dto.IsActive,
                CreatedBy= dto.CreatedBy,
            };
        }


    }
}
