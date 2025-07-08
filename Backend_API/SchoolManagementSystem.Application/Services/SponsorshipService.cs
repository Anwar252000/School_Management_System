using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class SponsorshipService : ISponsorship
    {
        private readonly IGenericRepository<Sponsorship> _sponsorshipRepository;
        private readonly SponsorshipMapper _mapper;


        public SponsorshipService(IGenericRepository<Sponsorship> genericRepository, SponsorshipMapper sponsorshipMapper)
        {
            _sponsorshipRepository = genericRepository;
            _mapper = sponsorshipMapper;

        }

        public async Task<int> AddSponsorshipAsync(SponsorshipDTO dto)
        {
            try
            {
                var model = _mapper.MapToEntity(dto);
                var sponsershipId = await _sponsorshipRepository.AddAsync(model);
                return (int)sponsershipId;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteSponsorshipAsync(int sponsorshipId)
        {
            var sponsors = await _sponsorshipRepository.GetByIdAsync(sponsorshipId);
            if (sponsors != null)
            {
                sponsors.IsActive = false;
                await _sponsorshipRepository.UpdateAsync(sponsors);
            }
        }


        public async Task<List<SponsorshipDTO>> GetAllSponsorshipsAsync()
        {
            try
            {
                var sponsorships = await _sponsorshipRepository.GetAllAsync(
            include: query => query
                .Include(sp => sp.Sponsor)
                .Include(sp => sp.SponsorshipDetails)
                    .ThenInclude(sd => sd.Class) // Include Class navigation property
                .Include(sp => sp.SponsorshipDetails)
                    .ThenInclude(sd => sd.Student) // Include Student navigation property
        );
                var activeSponsorships = sponsorships.Where(c => c.IsActive);
                var sponsorshipDtos = activeSponsorships.Select(c => _mapper.MapToDto(c)).ToList();
                return sponsorshipDtos;
            }
            catch (Exception)
            {

                throw;
            }
        }
        public async Task<SponsorshipDTO> GetSponsorshipByIdAsync(int sponsorshipId)
        {
            throw new NotImplementedException();
        }
        public async Task<List<SponsorshipDTO>> GetAllStudentBySponsorIdAsync(int sponsorId)
        {

            try
            {
                var sponsorStudent = await _sponsorshipRepository.GetAllAsync(
                    include: query => query
                    //.Include(s => s.Student)
                    .Include(sp => sp.Sponsor)
                    .Include(ss => ss.SponsorshipDetails)
                    );
                var studentSponsorships = sponsorStudent.Where(s => s.SponsorId == sponsorId).ToList();
                var activeSponsorStudent = studentSponsorships.Where(a => a.IsActive);
                var studentSponsorshipDtos = activeSponsorStudent.Select(c => _mapper.MapToDto(c)).ToList();
                return studentSponsorshipDtos;





            }
            catch (Exception)
            {

                throw;
            }


        }



        public async Task UpdateSponsorshipAsync(SponsorshipDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _sponsorshipRepository.UpdateAsync(model);
        }


    }
}
