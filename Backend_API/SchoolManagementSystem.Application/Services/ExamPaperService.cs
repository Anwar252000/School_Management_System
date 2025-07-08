using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;
using System.Linq;

namespace SchoolManagementSystem.Application.Services
{
    public class ExamPaperService : IExamPaper
    {
        private readonly IGenericRepository<ExamPaper> _examPaperRepository;
        private readonly ExamPaperMapper _examPaperMapper;
        private readonly ExamPaperUpdateMapper _examPaperUpdateMapper;

        public ExamPaperService(IGenericRepository<ExamPaper> genericRepository, ExamPaperMapper examPaperMapper, ExamPaperUpdateMapper examPaperUpdateMapper)
        {
            _examPaperRepository = genericRepository;
            _examPaperMapper = examPaperMapper;
            _examPaperUpdateMapper = examPaperUpdateMapper;

        }
        public async Task AddExamPaperAsync(ExamPaperDTO examPaper)
        {
            try
            {   
                var existingEntities = await _examPaperRepository.GetAllAsync(
                        x => x.ClassId == examPaper.ClassId && x.SubjectId == examPaper.SubjectId && x.IsActive
                        );
                if (existingEntities.Any())
                {
                    throw new Exception("Exam Paper is already available");
                }

                var entities = _examPaperMapper.MapToEntities(examPaper);

                foreach (var entity in entities)
                {
                    await _examPaperRepository.AddAsync(entity);
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while adding Exam Paper.", ex);
            }
        }

        public async Task UpdateExamPaperAsync(ExamPaperUpdateDTO examPaper)
        {
            try
            {
                var entities = _examPaperUpdateMapper.MapToEntities(examPaper);
                if(entities != null)
                {
                    foreach (var entity in entities)
                    {
                        if (entity.ExamPaperId != null)
                        {
                            await _examPaperRepository.UpdateAsync(entity);
                        }
                        else
                        {
                            await _examPaperRepository.AddAsync(entity);
                        }
                    }               
                }

            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating Exam Paper.", ex);
            }
        }


        public async Task DeleteExamPaperAsync(int exampaperId)
        {

            var existingEntities = await _examPaperRepository.GetAllAsync(cs => cs.ExamPaperId == exampaperId);

            foreach (var existingEntity in existingEntities)
            {
                existingEntity.IsActive = false;
                await _examPaperRepository.UpdateAsync(existingEntity);
            }

        }

        public async Task<List<ExamPaperDTO>> GetAllExamPapersAsync()
        {
            try
            {
                var examPapers = await _examPaperRepository.GetAllAsync(
                include: query => query
                .Include(s => s.Subject)
                .Include(s => s.Class)
                .Include(s => s.QuestionsBank)
                );
            var activeExamPapers = examPapers.Where(a => a.IsActive);
            var examPaperDtos = activeExamPapers.Select(c => _examPaperMapper.MapToDto(c)).ToList();

            return examPaperDtos;
            }
            catch (Exception)
            {

                throw;
            }
        }

    }
}
