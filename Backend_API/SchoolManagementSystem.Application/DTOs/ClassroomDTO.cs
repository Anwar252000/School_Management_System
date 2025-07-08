
namespace SchoolManagementSystem.Application.DTOs
{
    public class ClassroomDTO
    {
        public int ClassroomId { get; set; }
        public int CampusId { get; set; }
        public string RoomNumber { get; set; }
        public string Building { get; set; }
        public int Capacity { get; set; } 
        public bool IsActive { get; set; } = true;
    }
}
