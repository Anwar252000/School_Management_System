using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class ExamResultService : IExamResult
    {
        private readonly IGenericRepository<ExamResult> _examResultRepository;
        private readonly ExamResultMapper _examResultMapper;

        public ExamResultService(IGenericRepository<ExamResult> genericRepository, ExamResultMapper examResultMapper)
        {
            _examResultRepository = genericRepository;
            _examResultMapper = examResultMapper;
        }

        public async Task AddExamResultAsync(ExamResultDTO examResult)
        {
            try
            {
                var existingResults = await _examResultRepository.GetAllAsync();

                bool isDuplicate = examResult.ExamDetails != null && examResult.ExamDetails.Any(detail =>
                    existingResults.Any(existing =>
                        existing.StudentId == detail.StudentId &&
                        existing.ExamPaperId == detail.ExamPaperId));

                if (isDuplicate)
                {
                    throw new Exception("Duplicate exam results detected for the given student and exam paper.");
                }
                else
                {
                    if (examResult.ExamDetails != null)
                    {
                        var entities = _examResultMapper.MapToEntities(examResult);

                        foreach (var entity in entities)
                        {
                            await _examResultRepository.AddAsync(entity);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while adding Exam Result.", ex);
            }
        }




        public async Task UpdateExamResultAsync(ExamResultDTO examResult)
        {
            try
            {
                var entities = _examResultMapper.MapToEntities(examResult);
                if (entities != null)
                {
                    foreach (var entity in entities)
                    {
                        await _examResultRepository.UpdateAsync(entity);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating Exam Result.", ex);
            }
        }

        public async Task DeleteExamResultAsync(int examResultId)
        {
            try
            {
                var existingEntities = await _examResultRepository.GetByIdAsync(examResultId);
                if (existingEntities != null)
                {
                    existingEntities.IsActive = false;
                    await _examResultRepository.UpdateAsync(existingEntities);
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<ExamResultDTO>> GetAllExamResultsAsync()
        {
            try
            {
                var exams = await _examResultRepository.GetAllAsync(include: query => query
                    .Include(c => c.Student)
                    .ThenInclude(c => c.Academic.Class)
                    .Include(c => c.ExamPaper)
                    .ThenInclude(c => c.Subject)
                    );
                var results = exams.Where(a => a.IsActive);
                var resultDtos = results.Select(c => _examResultMapper.MapToDto(c)).ToList();
                return resultDtos;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<ExamResultDTO>> GetExamResultsByClassAsync(int classId)
        {
            try
            {
                var exams = await _examResultRepository.GetAllAsync(
                    filter: result => result.ExamPaper.ClassId == classId,
                    include: query => query
                    .Include(c => c.Student)
                    .ThenInclude(c => c.Academic.Class)
                    .Include(c => c.ExamPaper)
                    .ThenInclude(c => c.Subject)
                    );
                var results = exams.Where(a => a.IsActive);
                var resultDtos = results.Select(c => _examResultMapper.MapToDto(c)).ToList();
                return resultDtos;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<ExamResultDTO>> GetExamResultsByClassTermYearExamPaperAsync(int? classId, DateTime? year, int? examPaperId, string? termName)
        {

            try
            {
                var examResult = await _examResultRepository.GetAllAsync(
                    filter: result => result.ExamPaper.ClassId == classId || result.ExamPaperId == examPaperId || result.CreatedAt == year || result.ExamPaper.TermName == termName,

                    include: query => query
                    .Include(c => c.Student)
                    .ThenInclude(c => c.Academic.Class)
                    .Include(c => c.ExamPaper)
                    .ThenInclude(c => c.Subject)
                    );
                var results = examResult.Where(a => a.IsActive);
                var resultDtos = results.Select(c => _examResultMapper.MapToDto(c)).ToList();
                return resultDtos;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
