using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class ParentAccountMapper : IMapper<ParentAccountDTO, ParentAccount>
    {
        public ParentAccount MapToEntity(ParentAccountDTO dto)
        {
            return new ParentAccount
            {
                ParentAccountId = dto.ParentAccountId,
                AccountGroupId = dto.AccountGroupId,
                ParentAccountCode = dto.ParentAccountCode,
                ParentAccountName = dto.ParentAccountName,
                CreatedBy = dto.CreatedBy,
                CreatedAt = dto.CreatedAt,
                IsActive = dto.IsActive,
            };
        }

        public ParentAccountDTO MapToDto(ParentAccount entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            return new ParentAccountDTO
            {
                ParentAccountId = entity.ParentAccountId,
                AccountGroupId = entity.AccountGroupId,
                ParentAccountCode = entity.ParentAccountCode,
                ParentAccountName = entity.ParentAccountName,   
                AccountGroupName = entity.AccountGroup?.AccountGroupName,
                CreatedBy = entity.CreatedBy,
                CreatedAt = entity.CreatedAt = DateTime.UtcNow,
                //UpdatedBy = entity.UpdatedBy, // Added
                //UpdatedAt = entity.UpdatedAt, // Added
                IsActive = entity.IsActive = true,
            };
        }

        public List<ParentAccount> MapToEntities(ParentAccountDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<ParentAccount> MapToEntities(IEnumerable<ParentAccountDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
