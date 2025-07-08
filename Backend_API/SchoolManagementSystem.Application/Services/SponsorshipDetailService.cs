using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class SponsorshipDetailService : ISponsorshipDetail
    {
        private readonly IGenericRepository<SponsorshipDetail> _sponsorshipDetailRepository;
        private readonly SponsorshipDetailMapper _mapper;


        public SponsorshipDetailService(IGenericRepository<SponsorshipDetail> genericRepository, SponsorshipDetailMapper sponsorshipDetailMapper)
        {
            _sponsorshipDetailRepository = genericRepository;
            _mapper = sponsorshipDetailMapper;

        }


        public async Task<List<SponsorshipDetailDTO>> GetAllSponsorshipsDetailAsync()
        {
            try
            {
                var sponsorshipdetails = await _sponsorshipDetailRepository.GetAllAsync(
                    include: query => query
                    .Include(s => s.Student)
                    .Include(c => c.Class)
                    .Include(ss => ss.Sponsorship)
                    .ThenInclude(sp => sp.Sponsor)
                    );
                var activeSponsorshipdetails = sponsorshipdetails.Where(c => c.IsActive);
                var sponsorshipDetailDtos = activeSponsorshipdetails.Select(c => _mapper.MapToDto(c)).ToList();
                return sponsorshipDetailDtos;
            }
            catch (Exception)
            {

                throw;
            }
        }



        public async Task AddSponsorshipDetailAsync(SponsorshipDetailDTO dto)
        {
            try
            {
                var model = _mapper.MapToEntity(dto);
                object value = await _sponsorshipDetailRepository.AddAsync(model);
            }
            catch (Exception)
            {

                throw;
            }
        }

        //public async Task DeleteSponsorshipAsync(int sponsorshipId)
        //{
        //    var sponsors = await _sponsorshipRepository.GetByIdAsync(sponsorshipId);
        //    if (sponsors != null)
        //    {
        //        sponsors.IsActive = false;
        //        await _sponsorshipRepository.UpdateAsync(sponsors);
        //    }
        //}



        //public async Task<SponsorshipDTO> GetSponsorshipByIdAsync(int sponsorshipId)
        //{
        //    throw new NotImplementedException();
        //}
        //public async Task<List<SponsorshipDTO>> GetAllStudentBySponsorIdAsync(int sponsorId)
        //{

        //    try
        //    {
        //        var sponsorStudent = await _sponsorshipRepository.GetAllAsync(
        //            include: query => query
        //            .Include(s => s.Student)
        //            .Include(sp => sp.Sponsor)
        //            .Include(c => c.Class)
        //            );
        //        var studentSponsorships = sponsorStudent.Where(s => s.SponsorId == sponsorId).ToList();
        //        var activeSponsorStudent = studentSponsorships.Where(a => a.IsActive);
        //        var studentSponsorshipDtos = activeSponsorStudent.Select(c => _mapper.MapToDto(c)).ToList();
        //        return studentSponsorshipDtos;





        //    }
        //    catch (Exception)
        //    {

        //        throw;
        //    }


        //}



        //public async Task UpdateSponsorshipAsync(SponsorshipDTO dto)
        //{
        //    var model = _mapper.MapToEntity(dto);
        //    await _sponsorshipRepository.UpdateAsync(model);
        //}


    }
}
