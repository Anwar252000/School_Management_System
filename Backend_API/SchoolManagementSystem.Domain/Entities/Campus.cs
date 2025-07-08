using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolManagementSystem.Domain.Entities
{
    public class Campus
    {
        [Key]
        public int? CampusId { get; set; }

        [Required]
        [StringLength(100)]
        public string? CampusName { get; set; }

        [StringLength(255)]
        public string Address { get; set; }

        [StringLength(100)]
        public string? City { get; set; }

        [StringLength(100)]
        public string? State { get; set; }

        [StringLength(100)]
        public string? Country { get; set; }

        [StringLength(20)]
        public string? PostalCode { get; set; }

        [StringLength(15)]
        public string? PhoneNumber { get; set; }

        [StringLength(100)]
        public string? Email { get; set; }

        //public DateTime? CreatedAt { get; set; } = DateTime.Now;
        //public int? CreatedBy { get; set; }
        //public DateTime? UpdatedAt { get; set; }
        //public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation properties for related entities
        public virtual ICollection<Department>? Departments { get; set; }
        //public virtual ICollection<Classroom> Classrooms { get; set; }
        public virtual ICollection<Employee>? Employees { get; set; }

        public virtual ICollection<TimeTable>? TimeTables { get; set; }

        public Campus()
        {
            Departments = new HashSet<Department>();
            //Classrooms = new HashSet<Classroom>();
            Employees = new HashSet<Employee>();
        }
    }

}
