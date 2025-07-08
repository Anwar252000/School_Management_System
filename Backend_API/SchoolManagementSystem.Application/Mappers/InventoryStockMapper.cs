using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolManagementSystem.Application.Mappers
{
    public class InventoryStockMapper : IMapper<InventoryStockDTO, InventoryStock>
    {
        public InventoryStockDTO MapToDto(InventoryStock entity)
        {
            return new InventoryStockDTO
            {
                ItemId = entity.ItemId,
                ItemName = entity?.InventoryItems?.ItemName,
                Quantity = entity.Quantity,
                Remarks = entity.Remarks,
                StatusName = entity?.InventoryStatus?.StatusName,
                StockId = entity.StockId,
                TransactionDate = entity.TransactionDate,
                TransactionType = entity.TransactionType,
                CreatedAt = entity.CreatedAt,
                CreatedBy = entity.CreatedBy,
                IsActive = entity.IsActive,
                UpdatedAt = entity.UpdatedAt,
                UpdatedBy = entity.UpdatedBy
            };
        }

        public List<InventoryStock> MapToEntities(InventoryStockDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<InventoryStock> MapToEntities(IEnumerable<InventoryStockDTO> dto)
		{
			throw new NotImplementedException();
		}

		public InventoryStock MapToEntity(InventoryStockDTO dto)
        {
            return new InventoryStock
            {
                StockId = dto.StockId,
                Quantity = dto.Quantity,
                StatusId = dto.StatusId,
                TransactionType = dto.TransactionType,
                TransactionDate= dto.TransactionDate,
                Remarks = dto.Remarks,
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
