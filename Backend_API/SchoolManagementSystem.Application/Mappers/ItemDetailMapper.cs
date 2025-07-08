using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolManagementSystem.Application.Mappers
{
    public class ItemDetailMapper : IMapper<ItemDetailDTO, ItemDetail>
    {
        public ItemDetailDTO MapToDto(ItemDetail entity)
        {
            return new ItemDetailDTO
            {
                ItemId = entity.ItemId,
                ItemDetailId = entity.ItemDetailId,
                TagNumber = entity.TagNumber,
                CategoryName = entity?.InventoryItems?.InventoryCategories?.CategoryName,
                ItemName = entity?.InventoryItems?.ItemName,
                StatusId = entity.StatusId,
                StatusName = entity?.InventoryStatuses?.StatusName,
                CreatedAt = entity.CreatedAt,
                CreatedBy = entity.CreatedBy,
                IsActive = entity.IsActive,
                UpdatedAt = entity.UpdatedAt,
                UpdatedBy = entity.UpdatedBy
            };
        }

        public List<ItemDetail> MapToEntities(ItemDetailDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<ItemDetail> MapToEntities(IEnumerable<ItemDetailDTO> dto)
		{
			throw new NotImplementedException();
		}

		public ItemDetail MapToEntity(ItemDetailDTO dto)
        {
            return new ItemDetail
            {
                ItemDetailId = dto.ItemDetailId,
                StatusId = dto.StatusId,
                TagNumber = dto.TagNumber,
                ItemId = dto.ItemId,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = dto.CreatedBy,
                IsActive = true,
                UpdatedAt = dto.UpdatedAt,
                UpdatedBy = dto.UpdatedBy
            };
        }


    }
}
