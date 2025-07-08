using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;


namespace SchoolManagementSystem.Application.Services
{
    public class TaskItemService : ITaskItem
    {
        private readonly IGenericRepository<TaskItem> _taskRepository;
        private readonly TaskItemMapper _mapper;

        public TaskItemService(IGenericRepository<TaskItem> taskRepository, TaskItemMapper taskMapper)
        {
            _taskRepository = taskRepository;
            _mapper = taskMapper;
        }

        public async Task AssignTaskAsync(TaskItemDTO dto, IFormFile? beforeImage, IFormFile? afterImage)
        {
            try
            {
                string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                // Upload Before Image
                if (beforeImage != null && beforeImage.Length > 0)
                {
                    string beforeImageFileName = Guid.NewGuid().ToString() + Path.GetExtension(beforeImage.FileName);
                    string beforeImagePath = Path.Combine(uploadsFolder, beforeImageFileName);

                    using (var stream = new FileStream(beforeImagePath, FileMode.Create))
                    {
                        await beforeImage.CopyToAsync(stream);
                    }

                    dto.BeforeImageUrl = "/images/" + beforeImageFileName;
                }

                // Upload After Image
                if (afterImage != null && afterImage.Length > 0)
                {
                    string afterImageFileName = Guid.NewGuid().ToString() + Path.GetExtension(afterImage.FileName);
                    string afterImagePath = Path.Combine(uploadsFolder, afterImageFileName);

                    using (var stream = new FileStream(afterImagePath, FileMode.Create))
                    {
                        await afterImage.CopyToAsync(stream);
                    }

                    dto.AfterImageUrl = "/images/" + afterImageFileName;
                }

                // Map and save task entity
                var entity = _mapper.MapToEntity(dto);
                await _taskRepository.AddAsync(entity);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateTaskAsync(TaskItemDTO dto, IFormFile? beforeImage, IFormFile? afterImage)
        {
            var entity = await _taskRepository.GetByIdAsync(dto.TaskItemId);
            if (entity == null) throw new Exception("Task not found");

            entity.TaskDescription = dto.TaskDescription;
            entity.Priority = dto.Priority;
            entity.AssignedTo = dto.AssignedTo;
            entity.Status = dto.Status;
            entity.StartDate = dto.StartDate;
            entity.EndDate = dto.EndDate;
            entity.NotesAndRemarks = dto.NotesAndRemarks;
            entity.ApprovedBy = dto.ApprovedBy;
            entity.UpdatedAt = DateTime.UtcNow;
            entity.UpdatedBy = dto.UpdatedBy;

            // Handle before image
            if (beforeImage != null)
            {
                var beforeImagePath = await SaveFileAsync(beforeImage);
                entity.BeforeImageUrl = beforeImagePath;
            }

            // Handle after image
            if (afterImage != null)
            {
                var afterImagePath = await SaveFileAsync(afterImage);
                entity.AfterImageUrl = afterImagePath;
            }

            await _taskRepository.UpdateAsync(entity);
        }


        private async Task<string> SaveFileAsync(IFormFile file)
        {
            var uploadsFolder = Path.Combine("wwwroot", "images");
            Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/images/{fileName}";
        }


        public async Task DeleteTaskAsync(int taskId)
        {
            var task = await _taskRepository.GetByIdAsync(taskId);
            if (task != null)
            {
                task.IsActive = false;
                await _taskRepository.UpdateAsync(task);
            }
        }

        public async Task<List<TaskItemDTO>> GetAllTaskAsync()
        {
            var tasks = await _taskRepository.GetAllAsync(
                include: query => query
                .Include(x=>x.ApprovedUser)
                .Include(x => x.AssignedUser)
                );
            var activeTasks = tasks.Where(t => t.IsActive);

            var taskDtos = activeTasks.Select(t => _mapper.MapToDto(t)).ToList();
            return taskDtos;
        }

        public Task<TaskItemDTO> GetTaskByIdAsync(int taskId)
        {
            throw new NotImplementedException();
        }

    }
}
