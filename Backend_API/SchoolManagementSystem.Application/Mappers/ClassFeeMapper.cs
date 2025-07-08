using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Entities.Fee;

namespace SchoolManagementSystem.Application.Mappers
{
    public class ClassFeeMapper : IMapper<ClassFeeDTO, ClassFee>
    {


        public ClassFee MapToEntity(ClassFeeDTO dto)
        {
            return new ClassFee
            {
                ClassFeeId = dto.ClassFeeId,
                CampusId = dto.CampusId,
                ClassId = dto.ClassId,
                Amount = dto.Amount,
                FeeCategoryId = dto.FeeCategoryId,
                CreatedAt = dto.CreatedAt = DateTime.UtcNow,
                CreatedBy = (int)dto.CreatedBy,

            };
        }
        public ClassFeeDTO MapToDto(ClassFee entity)
        {
            return new ClassFeeDTO
            {
                ClassFeeId = entity.ClassFeeId,
                CampusId = entity.CampusId,
                ClassId = entity.ClassId,
                Amount = entity.Amount,
                ClassName = entity.Class.ClassName,
                CampusName = entity.Campus.CampusName,
                FeeName = entity.FeeCategory.FeeName,
                FeeCategoryId = entity.FeeCategoryId,
                CreatedAt = entity.CreatedAt = DateTime.UtcNow,
                CreatedBy = entity.CreatedBy,
                IsActive = entity.IsActive = true,

            };
        }

        public ClassFee MapDtoToEntity(ClassFeeDTO dto, ClassFee entity)
        {
            entity.ClassId = dto.ClassId;
            entity.CampusId = dto.CampusId;
            entity.FeeCategoryId = dto.FeeCategoryId;
            entity.Amount = dto.Amount;

            return entity;
        }
        public List<ClassFee> MapToEntities(ClassFeeDTO dto)
        {
            throw new NotImplementedException();
        }

        public List<ClassFee> MapToEntities(IEnumerable<ClassFeeDTO> dto)
        {
            throw new NotImplementedException();
        }
    }
}
