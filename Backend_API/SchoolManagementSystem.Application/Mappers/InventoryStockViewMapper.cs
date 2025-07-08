using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class InventoryStockViewMapper : IMapper<InventoryStockViewDTO, InventoryStockView>
    {
        public InventoryStockViewDTO MapToDto(InventoryStockView entity)
        {
            return new InventoryStockViewDTO
            {
                ItemId = entity.ItemId,
                CategoryName = entity.CategoryName,
                CurrentStock = entity.CurrentStock,
                ItemName = entity.ItemName,
                TotalStockIn = entity.TotalStockIn,
                TotalStockOut = entity.TotalStockOut
            };
        }

        public List<InventoryStockView> MapToEntities(InventoryStockViewDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<InventoryStockView> MapToEntities(IEnumerable<InventoryStockViewDTO> dto)
		{
			throw new NotImplementedException();
		}

		public InventoryStockView MapToEntity(InventoryStockViewDTO dto)
        {
            return new InventoryStockView
            {
                TotalStockOut = dto.TotalStockOut,
                TotalStockIn = dto.TotalStockIn,
                ItemName = dto.ItemName,
                CategoryName = dto.CategoryName,
                CurrentStock = dto.CurrentStock,
                ItemId = dto.ItemId
            };
        }


    }
}
