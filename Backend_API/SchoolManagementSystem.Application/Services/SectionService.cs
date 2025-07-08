using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class SectionService : ISection
    {
        private readonly IGenericRepository<Section> _sectionRepository;
        private readonly SectionMapper _mapper;


        public SectionService(IGenericRepository<Section> genericRepository, SectionMapper sectionMapper)
        {
            _sectionRepository = genericRepository;
            _mapper = sectionMapper;

        }

        public async Task AddSectionAsync(SectionDTO sec)
        {
            try
            {
                var model = _mapper.MapToEntity(sec);
                await _sectionRepository.AddAsync(model);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteSectionAsync(int sectionId)
        {
            var sections = await _sectionRepository.GetByIdAsync(sectionId);
            if (sections != null)
            {
                sections.IsActive = false;
                await _sectionRepository.UpdateAsync(sections);
            }
        }

        public async Task<List<SectionDTO>> GetAllSectionAsync()
        {
            try
            {
                var sections = await _sectionRepository.GetAllAsync();
                var activeSections = sections.Where(c => c.IsActive);

                // Map the entities to DTOs
                var sectionDtos = activeSections.Select(c => _mapper.MapToDto(c)).ToList();

                return sectionDtos;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<SectionDTO> GetSectionByIdAsync(int? sectionId)
        {
            var response = await _sectionRepository.GetByIdAsync((int)sectionId);
            return _mapper.MapToDto(response);
        }

        public async Task UpdateSectionAsync(SectionDTO sec)
        {
            var model = _mapper.MapToEntity(sec);
            await _sectionRepository.UpdateAsync(model, true);
        }

        
    }
}
