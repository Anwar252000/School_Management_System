using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class DashboardCountViewService : IDashboardCountView
    {
        private readonly IGenericRepository<DashboardCountView> _dashboardCountViewRepository;
        private readonly DashboardCountViewMapper _mapper;


        public DashboardCountViewService(IGenericRepository<DashboardCountView> genericRepository, DashboardCountViewMapper dashboardCountViewMapper)
        {
            _dashboardCountViewRepository = genericRepository;
            _mapper = dashboardCountViewMapper;
        }

        public async Task<DashboardCountViewDTO> GetDasboardCountViewAsync()
        {
            var counts = await _dashboardCountViewRepository.GetAllAsync();

            var countDtos = _mapper.MapToDto(counts.FirstOrDefault());

            return countDtos;
        }
    }


}

