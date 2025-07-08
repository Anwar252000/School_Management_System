using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class SponsorService : ISponsor
    {
        private readonly IGenericRepository<Sponsor> _sponsorRepository;
        private readonly SponsorMapper _mapper;


        public SponsorService(IGenericRepository<Sponsor> genericRepository, SponsorMapper sponsorMapper)
        {
            _sponsorRepository = genericRepository;
            _mapper = sponsorMapper;

        }

        public async Task AddSponsorAsync(SponsorDTO dto)
        {
            try
            {
                var model = _mapper.MapToEntity(dto);
                await _sponsorRepository.AddAsync(model);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteSponsorAsync(int sponsorId)
        {
            var sponsors = await _sponsorRepository.GetByIdAsync(sponsorId);
            if (sponsors != null)
            {
                sponsors.IsActive = false;
                await _sponsorRepository.UpdateAsync(sponsors);
            }
        }

        public async Task<List<SponsorDTO>> GetAllSponsorsAsync()
        {
            try
            {
                var sponsors = await _sponsorRepository.GetAllAsync();
                var activeSponsors = sponsors.Where(c => c.IsActive);
                var sponsorDtos = activeSponsors.Select(c => _mapper.MapToDto(c)).ToList();

                return sponsorDtos;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task UpdateSponsorAsync(SponsorDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _sponsorRepository.UpdateAsync(model);
        }

        
    }
}
