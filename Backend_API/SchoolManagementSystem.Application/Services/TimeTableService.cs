using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class TimeTableService : ITimeTable
    {
        private readonly IGenericRepository<TimeTable> _genericRepository;
        private readonly TimeTableMapper _timeTableMapper;
        private readonly IGenericRepository<TimeTableView> _timeTableViewRepository;
        private readonly TimeTableViewMapper _timeTableViewMapper;

        public TimeTableService(IGenericRepository<TimeTable> genericRepository, IGenericRepository<TimeTableView> timeTableViewRepository, TimeTableViewMapper timeTableViewMapper, TimeTableMapper timeTableMapper)
        {
            _genericRepository = genericRepository;
            _timeTableMapper = timeTableMapper;
            _timeTableViewRepository = timeTableViewRepository;
            _timeTableViewMapper = timeTableViewMapper;
        }

        public async Task AddTimeTableAsync(TimeTableDTO dto)
        {
            var existingEntry = await _genericRepository.GetAllAsync(

                x => x.ClassId == dto.ClassId && x.PeriodId == dto.PeriodId && x.DayOfWeek == dto.DayOfWeek && x.IsActive 
            );

            if (existingEntry.Any())
            {
                throw new InvalidOperationException("A timetable entry for the same class and period already exists.");
            }

            var model = _timeTableMapper.MapToEntity(dto);
            await _genericRepository.AddAsync(model);
        }

        public async Task DeleteTimeTableAsync(int timeTableId)
        {
            var result = await _genericRepository.GetByIdAsync(timeTableId);
            if (result != null)
            {
                result.IsActive = false;
                await _genericRepository.UpdateAsync(result);
            }
        }

        //public async Task<List<TimeTableDTO>> GetAllTimeTablesAsync()
        //{
        //    try
        //    {
        //        var result = await _genericRepository.GetAllAsync(
        //        include: query => query
        //        .Include(c => c.Campus)
        //        .Include(c => c.Class)
        //        .Include(s => s.Period)
        //        .Include(s => s.Subject)
        //        );
        //        var activeResult = result.Where(s => s.IsActive).ToList();
        //        var lst = activeResult.Select(_timeTableMapper.MapToDto).ToList();

        //        return lst;
        //    }
        //    catch (Exception)
        //    {

        //        throw;
        //    }
        //}

        public async Task<List<TimeTableViewDTO>> GetAllTimeTablesAsync()
        {
            //var lst = new List<TimeTableViewDTO>();
            var timetableEntities = await _timeTableViewRepository.GetAllAsync();
            var lst = timetableEntities.ToList(); // Convert to List
            var result = new List<TimeTableViewDTO>();

            lst.ForEach(x => result.Add(_timeTableViewMapper.MapToDto(x)));

            return result;
        }


        public async Task UpdateTimeTableAsync(TimeTableDTO dto)
        {
            try
            {
                var model = _timeTableMapper.MapToEntity(dto);
                await _genericRepository.UpdateAsync(model);

            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating TimeTable.", ex);
            }
        }
    }
}
