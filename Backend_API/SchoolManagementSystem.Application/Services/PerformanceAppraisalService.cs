using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;
using System.Data;

namespace SchoolManagementSystem.Application.Services
{

    public class PerformanceAppraisalService : IPerformanceAppraisal
    {
        private readonly IGenericRepository<PerformanceAppraisal> _appraisalRepository;
        private readonly PerformanceAppraisalMapper _mapper;

        public PerformanceAppraisalService(IGenericRepository<PerformanceAppraisal> genericRepository, PerformanceAppraisalMapper appraisalMapper)
        {
            _appraisalRepository = genericRepository;
            _mapper = appraisalMapper;
        }

        public async Task AddPerformanceAppraisalAsync(PerformanceAppraisalDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _appraisalRepository.AddAsync(model);
        }

        public async Task DeletePerformanceAppraisalAsync(int appId)
        {
            var appraisal = await _appraisalRepository.GetByIdAsync(appId);
            if (appraisal != null)
            {
                appraisal.IsActive = false;
                await _appraisalRepository.UpdateAsync(appraisal);
            }

        }

        public async Task<List<PerformanceAppraisalDTO>> GetAllPerformanceAppraisalAsync()
        {
            try
            {
                var appraisal = await _appraisalRepository.GetAllAsync(
                    include: query => query
                    .Include(e => e.Employee)
                    );

                var activeappraisal = appraisal.Where(e => e.IsActive).ToList();

                var result = activeappraisal

                    .Select(e => _mapper.MapToDto(e)).ToList();
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task UpdatePerformanceAppraisalAsync(PerformanceAppraisalDTO dto)
        {
            try
            {
                var model = _mapper.MapToEntity(dto);
                await _appraisalRepository.UpdateAsync(model);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}