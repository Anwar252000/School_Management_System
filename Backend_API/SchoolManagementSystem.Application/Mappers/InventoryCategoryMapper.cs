using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolManagementSystem.Application.Mappers
{
	public class InventoryCategoryMapper : IMapper<InventoryCategoryDTO, InventoryCategory>
    {
        public InventoryCategoryDTO MapToDto(InventoryCategory entity)
        {
            return new InventoryCategoryDTO
            {
                CategoryId = entity.CategoryId,
                CategoryName = entity.CategoryName,
                CreatedAt = entity.CreatedAt,
                CreatedBy = entity.CreatedBy,
                Description = entity.Description,
                IsActive = entity.IsActive,
                UpdatedAt = entity.UpdatedAt,
                UpdatedBy = entity.UpdatedBy
            };
        }

        public List<InventoryCategory> MapToEntities(InventoryCategoryDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<InventoryCategory> MapToEntities(IEnumerable<InventoryCategoryDTO> dto)
		{
			throw new NotImplementedException();
		}

		public InventoryCategory MapToEntity(InventoryCategoryDTO dto)
        {
            return new InventoryCategory
            {
                CategoryId = dto.CategoryId,
                CategoryName = dto.CategoryName,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = dto.CreatedBy,
                Description = dto.Description,
                IsActive = true,
                UpdatedAt = dto.UpdatedAt,
                UpdatedBy = dto.UpdatedBy
            };
        }


    }
}
