using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
	public class InventoryPurchaseMapper : IMapper<InventoryPurchaseDTO, InventoryPurchase>
    {
        public InventoryPurchaseDTO MapToDto(InventoryPurchase entity)
        {
            return new InventoryPurchaseDTO
            {
                PurchaseId = entity.PurchaseId,
                ItemId = entity.ItemId,
                ItemName = entity.InventoryItems.ItemName,
                SupplierName = entity.SupplierName,
                Quantity = entity.Quantity,
                UnitPrice = entity.UnitPrice,
                TotalCost = entity.TotalCost,
                PurchaseDate = entity.PurchaseDate,
                InvoiceNumber = entity.InvoiceNumber,
                Remarks = entity.Remarks,               
                CreatedAt = entity.CreatedAt,
                CreatedBy = entity.CreatedBy,
                IsActive = entity.IsActive,
                UpdatedAt = entity.UpdatedAt,
                UpdatedBy = entity.UpdatedBy
            };
        }

        public List<InventoryPurchase> MapToEntities(InventoryPurchaseDTO dto)
        {
            throw new NotImplementedException();
        }

        public InventoryPurchase MapToEntity(InventoryPurchaseDTO dto)
        {
            return new InventoryPurchase
            {
                PurchaseId = dto.PurchaseId,
                ItemId = dto.ItemId,
                SupplierName = dto.SupplierName,
                Quantity = dto.Quantity,
                UnitPrice = dto.UnitPrice,
                TotalCost = dto.TotalCost,
                PurchaseDate = dto.PurchaseDate,
                InvoiceNumber = dto.InvoiceNumber,
                Remarks = dto.Remarks,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = dto.CreatedBy,
                IsActive = true,
                UpdatedAt = dto.UpdatedAt,
                UpdatedBy = dto.UpdatedBy
            };
        }

		InventoryPurchaseDTO IMapper<InventoryPurchaseDTO, InventoryPurchase>.MapToDto(InventoryPurchase entity)
		{
			throw new NotImplementedException();
		}

		List<InventoryPurchase> IMapper<InventoryPurchaseDTO, InventoryPurchase>.MapToEntities(InventoryPurchaseDTO dto)
		{
			throw new NotImplementedException();
		}

		List<InventoryPurchase> IMapper<InventoryPurchaseDTO, InventoryPurchase>.MapToEntities(IEnumerable<InventoryPurchaseDTO> dto)
		{
			throw new NotImplementedException();
		}

		InventoryPurchase IMapper<InventoryPurchaseDTO, InventoryPurchase>.MapToEntity(InventoryPurchaseDTO dto)
		{
			throw new NotImplementedException();
		}
	}
}
