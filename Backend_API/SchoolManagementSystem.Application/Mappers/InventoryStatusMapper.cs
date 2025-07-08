using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolManagementSystem.Application.Mappers
{
    public class InventoryStatusMapper : IMapper<InventoryStatusDTO, InventoryStatus>
    {
        public InventoryStatusDTO MapToDto(InventoryStatus entity)
        {
            return new InventoryStatusDTO
            {
                StatusId = entity.StatusId,
                StatusName = entity.StatusName,
                CreatedAt = entity.CreatedAt,
                CreatedBy = entity.CreatedBy,
                IsActive = entity.IsActive,
                UpdatedAt = entity.UpdatedAt,
                UpdatedBy = entity.UpdatedBy
            };
        }

        public List<InventoryStatus> MapToEntities(InventoryStatusDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<InventoryStatus> MapToEntities(IEnumerable<InventoryStatusDTO> dto)
		{
			throw new NotImplementedException();
		}

		public InventoryStatus MapToEntity(InventoryStatusDTO dto)
        {
            return new InventoryStatus
            {
                StatusName = dto.StatusName,
                StatusId = dto.StatusId,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = dto.CreatedBy,
                IsActive = true,
                UpdatedAt = dto.UpdatedAt,
                UpdatedBy = dto.UpdatedBy
            };
        }


    }
}
