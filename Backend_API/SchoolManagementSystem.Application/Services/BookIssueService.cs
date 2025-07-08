using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs.Library;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities.Library;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class BookIssueService : IBookIssue
    {
        private readonly IGenericRepository<BookIssue> _issueRepository;
        private readonly BookIssueMapper _mapper;

        public BookIssueService(IGenericRepository<BookIssue> issueRepository, BookIssueMapper mapper)
        {
            _issueRepository = issueRepository;
            _mapper = mapper;
        }

        public async Task AddIssueAsync(BookIssueDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _issueRepository.AddAsync(model);
        }

        public async Task DeleteIssueAsync(int issueId)
        {
            var entity = await _issueRepository.GetByIdAsync(issueId);
            if (entity != null)
            {
                entity.IsActive = false;
                await _issueRepository.UpdateAsync(entity);
            }
        }

        public async Task<List<BookIssueDTO>> GetAllIssueAsync()
        {
            var entities = await _issueRepository.GetAllAsync(
                include: q => q.Include(b => b.Book)
            );

            return entities
                .Where(e => e.IsActive)
                .Select(e => _mapper.MapToDto(e)).ToList();
        }

        public async Task UpdateIssueAsync(BookIssueDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _issueRepository.UpdateAsync(model);
        }
    }
}
