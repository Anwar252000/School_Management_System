using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class QuestionBankService : IQuestionBank
    {
        private readonly IGenericRepository<QuestionBank> _questionRepository;
        private readonly QuestionBankMapper _questionBankMapper;
       

        public QuestionBankService(IGenericRepository<QuestionBank> genericRepository, QuestionBankMapper questionBankMapper)
        {
            _questionRepository = genericRepository;
            _questionBankMapper = questionBankMapper;
        }

        public async Task AddQuestionsAsync(QuestionBankDto dto)
        {
            var existingEntry = await _questionRepository.GetAllAsync(
                x => x.QuestionBankId == dto.QuestionBankId && x.IsActive == dto.IsActive
            );

            if (existingEntry.Any())
            {
                throw new InvalidOperationException("A question for the same class already exists.");
            }

            var model = _questionBankMapper.MapToEntity(dto);
            await _questionRepository.AddAsync(model);
        }

        public async Task DeleteQuestionAsync(int questionId)
        {
            var result = await _questionRepository.GetByIdAsync(questionId);
            if (result != null)
            {
                result.IsActive = false;
                await _questionRepository.UpdateAsync(result);
            }
        }

        public async Task<List<QuestionBankDto>> GetAllQuestionsAsync()
        {
            try
            {
                var result = await _questionRepository.GetAllAsync(
                    include: query => query
                    .Include(c => c.Class)
                    .Include(s => s.Subject)
                    );
                var activeResult = result.Where(s => s.IsActive);
                var list = activeResult.Select(x => _questionBankMapper.MapToDto(x)).ToList();

                return list;
            }
            catch (Exception)
            {

                throw;
            }
        }


        public async Task UpdateQuestionAsync(QuestionBankDto dto)
        {
            var model = _questionBankMapper.MapToEntity(dto);
            await _questionRepository.UpdateAsync(model);
        }

        
    }
}
