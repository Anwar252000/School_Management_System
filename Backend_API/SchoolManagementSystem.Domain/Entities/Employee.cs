using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class Employee
    {
        [Key]
        public int? EmployeeId { get; set; }

        [ForeignKey("EmployeeRole")]
        public int? RoleId { get; set; }

        [ForeignKey("Campus")]
        public int? CampusId { get; set; }

        [ForeignKey("Department")]
        public int? DepartmentId { get; set; }

        [StringLength(50)]
        public string FirstName { get; set; }

        [StringLength(50)]
        public string? LastName { get; set; }

        [StringLength(100)]
        public string? Email { get; set; }

        [StringLength(15)]
        public string? PhoneNumber { get; set; }

        public DateTime? HireDate { get; set; }

        [StringLength(255)]
        public string Address { get; set; }

        [StringLength(50)]
        public string? EmergencyContact { get; set; }

        [StringLength(255)]
        public string Qualifications { get; set; }

        [Required]
        public DateTime? CreatedAt { get; set; }

        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }

        [Required]
        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public EmployeeRole? EmployeeRole { get; set; }
        public Campus? Campus { get; set; }
        public Department? Departments { get; set; }
        public User? CreatedUser { get; set; }
        public User? UpdatedUser { get; set; }
    }

}
