using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class CampusService : ICampuses
    {
        private readonly IGenericRepository<Campus> _campusRepository;
        private readonly CampusMapper _mapper;

        public CampusService(IGenericRepository<Campus> genericRepository, CampusMapper campusMapper)
        {
            _campusRepository = genericRepository;
            _mapper = campusMapper;
        }

        public async Task AddCampusAsync(CampusDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _campusRepository.AddAsync(model);
        }

        public async Task DeleteCampusAsync(int campusId)
        {
            var campus = await _campusRepository.GetByIdAsync(campusId);
            if (campus != null)
            {
                campus.IsActive = false;
                await _campusRepository.UpdateAsync(campus);
            }
        }

        public async Task<List<CampusDTO>> GetAllCampusesAsync()
        {
            var campuses = await _campusRepository.GetAllAsync(
                include: query => query.Include(c => c.Departments.Where(d=>d.IsActive)));
            var activeCampuses = campuses.Where(c => c.IsActive).ToList();

            var lst = activeCampuses.Select(_mapper.MapToDtoWithSubEntity).ToList();


            return lst;
        }

        public async Task<CampusDTO> GetCampusByIdAsync(int campusId)
        {
           var response = await _campusRepository.GetByIdAsync(campusId);
            return _mapper.MapToDto(response);
        }

        public async Task UpdateCampusAsync(CampusDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _campusRepository.UpdateAsync(model);
        }
    }
}
