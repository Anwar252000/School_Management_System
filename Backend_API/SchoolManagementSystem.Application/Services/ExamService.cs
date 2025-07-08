using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;
using System.Linq;

namespace SchoolManagementSystem.Application.Services
{
    public class ExamService : IExam
    {
        private readonly IGenericRepository<Exam> _examRepository;
        private readonly ExamMapper _examMapper;

        public ExamService(IGenericRepository<Exam> genericRepository, ExamMapper examMapper)
        {
            _examRepository = genericRepository;
            _examMapper = examMapper;
        }
        public async Task AddExamAsync(ExamDTO exam)
        {
            try
            {   
                var existingEntities = await _examRepository.GetAllAsync(
                        x => x.ExamPaperId == exam.ExamPaperId && x.IsActive
                        );
                if (existingEntities.Any())
                {
                    throw new Exception("Exam Paper is already available");
                }

                var entities = _examMapper.MapToEntity(exam);
                await _examRepository.AddAsync(entities);
                
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while adding Exam Paper.", ex);
            }
        }

        public async Task UpdateExamAsync(ExamDTO exam)
        {
            try
            {
                var entities = _examMapper.MapToEntity(exam);
                await _examRepository.UpdateAsync(entities);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating Exam Paper.", ex);
            }
        }


        public async Task DeleteExamAsync(int examId)
        {
            try
            {
                var existingEntities = await _examRepository.GetByIdAsync(examId);
                if(existingEntities != null)
                {
                    existingEntities.IsActive = false;
                    await _examRepository.UpdateAsync(existingEntities);
                }
            }
            catch (Exception)
            {
                throw;
            }
        }


        public async Task<List<ExamDTO>> GetAllExamsAsync()
        {
            try
            {
                var exams = await _examRepository.GetAllAsync(include: query => query
                    .Include(c => c.Class)
                    .Include(s => s.Subject)
                    .Include(c => c.ExamPaper)
                    .Include(c => c.Campus)
                    );
                var activeExams = exams.Where(a => a.IsActive);
                var examDtos = activeExams.Select(c => _examMapper.MapToDto(c)).ToList();

                return examDtos;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<ExamDTO> GetByExamIdAsync(int examId)
        {
            try
            {
                var exams = await _examRepository.GetByIdAsync(examId);
                return _examMapper.MapToDto(exams);
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
