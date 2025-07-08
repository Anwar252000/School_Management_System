using Microsoft.AspNetCore.Http;
using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface ITaskItem
    {
        Task<List<TaskItemDTO>> GetAllTaskAsync();
        Task<TaskItemDTO> GetTaskByIdAsync(int taskId);
        Task AssignTaskAsync(TaskItemDTO dto, IFormFile? beforeImage, IFormFile? afterImage);
        Task UpdateTaskAsync(TaskItemDTO dto, IFormFile? beforeImage, IFormFile? afterImage);
        Task DeleteTaskAsync(int taskId);
    }

}
