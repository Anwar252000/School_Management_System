using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class PeriodService : IPeriod
    {
        private readonly IGenericRepository<Period> _genericRepository;
        private readonly PeriodMapper _periodMapper;

        public PeriodService(IGenericRepository<Period> genericRepository, PeriodMapper periodMapper)
        {
            _genericRepository = genericRepository;
            _periodMapper = periodMapper;
        }

        public async Task AddPeriodAsync(PeriodDTO dto)
        {
            var existingPeriod = await _genericRepository.GetAllAsync(
                x => x.PeriodName == dto.PeriodName && x.IsActive || x.StartTime == dto.StartTime && x.IsActive
                );
            if (existingPeriod.Any() ) 
            {
                throw new InvalidOperationException("Period with the Same StartTime or EndTime has already been assigned.");
            }
            var model = _periodMapper.MapToEntity(dto);
            await _genericRepository.AddAsync(model);
        }

        public async Task DeletePeriodAsync(int periodId)
        {
            var result = await _genericRepository.GetByIdAsync(periodId);
            if (result != null)
            {
                result.IsActive = false;
                await _genericRepository.UpdateAsync(result);
            }
        }

        public async Task<List<PeriodDTO>> GetAllPeriodAsync()
        {
            try
            {
                var result = await _genericRepository.GetAllAsync();
                var activeResult = result.Where(s => s.IsActive).ToList();
                var lst = activeResult.Select(_periodMapper.MapToDto).ToList();

                return lst;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task UpdatePeriodAsync(PeriodDTO dto)
        {
            var model = _periodMapper.MapToEntity(dto);
            await _genericRepository.UpdateAsync(model);
        }

    }
}
