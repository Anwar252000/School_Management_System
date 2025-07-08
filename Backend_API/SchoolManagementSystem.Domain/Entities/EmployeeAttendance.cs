using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class EmployeeAttendance
    {
        [Key]
        public int EmployeeAttendanceId { get; set; }

        [Required]
        [ForeignKey("EmployeeId")]
        public int? EmployeeId { get; set; }


        //[ForeignKey("CampusId")]
        //public int? CampusId { get; set; }

        [Required]
        public DateOnly? AttendanceDate { get; set; }

        [MaxLength(20)]
        public string? AttendanceStatus { get; set; }

        public DateTime? CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }
        [Required]
        public bool IsActive { get; set; }

        // Navigation Properties

        public Employee? Employee { get; set; }
        //public Campus? Campus { get; set; }
        public User? CreatedUser { get; set; }
        public User? UpdatedUser { get; set; }
    }
}
