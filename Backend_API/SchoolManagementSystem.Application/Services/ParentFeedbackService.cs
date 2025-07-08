using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class ParentFeedbackService : IParentFeedback
    {
        private readonly IGenericRepository<ParentFeedback> _parentFeedbackRepository;
        private readonly ParentFeedbackMapper _mapper;


        public ParentFeedbackService(IGenericRepository<ParentFeedback> genericRepository, ParentFeedbackMapper parentFeedbackMapper)
        {
            _parentFeedbackRepository = genericRepository;
            _mapper = parentFeedbackMapper;

        }

        public async Task AddParentFeedbackAsync(ParentFeedbackDTO dto)
        {
            try
            {
                var model = _mapper.MapToEntity(dto);
                await _parentFeedbackRepository.AddAsync(model);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteParentFeedbackAsync(int parentFeedbackId)
        {
            var parentFeedback = await _parentFeedbackRepository.GetByIdAsync(parentFeedbackId);
            if (parentFeedback != null)
            {
                parentFeedback.IsActive = false;
                await _parentFeedbackRepository.UpdateAsync(parentFeedback);
            }
        }

        public async Task<List<ParentFeedbackDTO>> GetAllParentFeedbackAsync()
        {
            var parentFeedback = await _parentFeedbackRepository.GetAllAsync(
                include: query => query
                .Include(s => s.Student)
                .Include(p => p.Parent)
                );
            var activeparentFeedback = parentFeedback.Where(c => c.IsActive);

            var parentFeedbackDtos = activeparentFeedback.Select(c => _mapper.MapToDto(c)).ToList();
            return parentFeedbackDtos;
        }

        public async Task UpdateParentFeedbackAsync(ParentFeedbackDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _parentFeedbackRepository.UpdateAsync(model);

        }
    }
}
