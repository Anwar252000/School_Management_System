using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class AssetAllocationMapper : IMapper<AssetAllocationDTO, AssetAllocation>
    {
        public AssetAllocationDTO MapToDto(AssetAllocation entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            return new AssetAllocationDTO
            {
                AllocatedBy = entity.AllocatedBy,
                AllocatedLocation = entity.AllocatedLocation,
                AllocatedTo = entity.AllocatedTo,
                AllocationDate = entity.AllocationDate,
                AllocationId = entity.AllocationId,
                ItemId = entity.ItemId,
                ItemName = entity?.InventoryItems?.ItemName,
                AllocatedByName = entity?.Users?.UserName,
                StatusId = entity.StatusId,
                StatusName = entity?.InventoryStatuses?.StatusName,
                CreatedAt = entity.CreatedAt,
                CreatedBy = entity.CreatedBy,
                UpdatedAt = entity.UpdatedAt,
                UpdatedBy = entity.UpdatedBy,
                IsActive = entity.IsActive,
                Quantity = entity.Quantity,

            };
        }

        public List<AssetAllocation> MapToEntities(AssetAllocationDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<AssetAllocation> MapToEntities(IEnumerable<AssetAllocationDTO> dto)
		{
			throw new NotImplementedException();
		}

		public AssetAllocation MapToEntity(AssetAllocationDTO dto)
        {
            if (dto == null)
            {
                throw new ArgumentNullException(nameof(dto));
            }

            return new AssetAllocation
            {
                ItemId = dto.ItemId,
                StatusId = dto.StatusId,
                AllocatedBy = dto.AllocatedBy,
                AllocatedLocation = dto.AllocatedLocation,
                AllocatedTo = dto.AllocatedTo,
                AllocationDate = dto.AllocationDate,
                AllocationId = dto.AllocationId,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = dto.CreatedBy,
                UpdatedAt = dto.UpdatedAt,
                UpdatedBy = dto.UpdatedBy,
                Quantity = dto.Quantity,
                IsActive = true,
            };

        }
    }
}
