using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;


namespace SchoolManagementSystem.Application.Mappers
{
    public class TaskItemMapper : IMapper<TaskItemDTO, TaskItem>
    {
        public TaskItem MapToEntity(TaskItemDTO dto)
        {
            return new TaskItem
            {
                TaskItemId = dto.TaskItemId,
                TaskName = dto.TaskName,
                TaskDescription = dto.TaskDescription,
                BeforeImageUrl = dto.BeforeImageUrl,
                AfterImageUrl = dto.AfterImageUrl,
                Priority = dto.Priority,
                AssignedTo = dto.AssignedTo,
                Status = dto.Status,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                ApprovedBy = dto.ApprovedBy,
                DateOfApproval = dto.DateOfApproval,
                NotesAndRemarks = dto.NotesAndRemarks,
                CreatedBy = dto.CreatedBy,
                CreatedAt = dto.CreatedAt = DateTime.UtcNow,
                IsActive = dto.IsActive = true
            };
        }

        public TaskItemDTO MapToDto(TaskItem entity)
        {
            return new TaskItemDTO
            {
                TaskItemId = entity.TaskItemId,
                TaskName = entity.TaskName,
                TaskDescription = entity.TaskDescription,
                BeforeImageUrl = entity.BeforeImageUrl,
                AfterImageUrl = entity.AfterImageUrl,
                Priority = entity.Priority,
                AssignedTo = entity.AssignedTo,
                AssignedUserName = entity.AssignedUser != null
                    ? entity.AssignedUser.UserName
                    : null,
                Status = entity.Status,
                StartDate = entity.StartDate,
                EndDate = entity.EndDate,
                ApprovedBy = entity.ApprovedBy,
                ApprovedByUserName = entity.ApprovedUser != null
                    ? entity.ApprovedUser.UserName : null,
                DateOfApproval = entity.DateOfApproval,
                NotesAndRemarks = entity.NotesAndRemarks,
                CreatedBy = entity.CreatedBy,
                CreatedAt = entity.CreatedAt = DateTime.UtcNow,
                IsActive = entity.IsActive
            };
        }

        public List<TaskItem> MapToEntities(TaskItemDTO dto)
        {
            throw new NotImplementedException();
        }

        public List<TaskItem> MapToEntities(IEnumerable<TaskItemDTO> dto)
        {
            throw new NotImplementedException();
        }
    }
}
