using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IInventoryCategories
    {
        Task<List<InventoryCategoryDTO>> GetAllInventoryCategoriesAsync();
        Task<InventoryCategoryDTO> GetInventoryCategoryByIdAsync(int categoryId);
        Task AddInventoryCategoryAsync(InventoryCategoryDTO category);
        Task UpdateInventoryCategoryAsync(InventoryCategoryDTO category);
        Task DeleteInventoryCategoryAsync(int categoryId);
    }
}
