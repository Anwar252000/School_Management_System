using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface ICampuses
    {
        Task<List<CampusDTO>> GetAllCampusesAsync();
        Task<CampusDTO> GetCampusByIdAsync(int campusId);
        Task AddCampusAsync(CampusDTO campus);
        Task UpdateCampusAsync(CampusDTO campus);
        Task DeleteCampusAsync(int campusId);
        
    }
}
