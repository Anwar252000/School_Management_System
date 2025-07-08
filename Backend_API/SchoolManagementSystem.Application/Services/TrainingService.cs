using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;
using System.Data;

namespace SchoolManagementSystem.Application.Services
{

    public class TrainingService : ITraining
    {
        private readonly IGenericRepository<Training> _trainingRepository;
        private readonly TrainingMapper _mapper;

        public TrainingService(IGenericRepository<Training> genericRepository, TrainingMapper trainingMapper)
        {
            _trainingRepository = genericRepository;
            _mapper = trainingMapper;
        }

        public async Task AddTrainingAsync(TrainingDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _trainingRepository.AddAsync(model);
        }

        public async Task DeleteTrainingAsync(int trainingId)
        {
            var training = await _trainingRepository.GetByIdAsync(trainingId);
            if (training != null)
            {
                training.IsActive = false;
                await _trainingRepository.UpdateAsync(training);
            }

        }

        public async Task<List<TrainingDTO>> GetAllTrainingAsync()
        {
            try
            {
                var training = await _trainingRepository.GetAllAsync(
                    include: query => query
                    .Include(e => e.Employee)
                    );

                var activeTraining = training.Where(e => e.IsActive).ToList();

                var result = activeTraining

                    .Select(e => _mapper.MapToDto(e)).ToList();
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task UpdateTrainingAsync(TrainingDTO dto)
        {
            try
            {
                var model = _mapper.MapToEntity(dto);
                await _trainingRepository.UpdateAsync(model);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}