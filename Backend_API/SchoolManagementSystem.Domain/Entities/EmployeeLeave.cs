using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace SchoolManagementSystem.Domain.Entities
{
    public class EmployeeLeave
    {
        [Key]
        public int EmployeeLeaveId { get; set; }

        [ForeignKey("Employees")]
        public int? EmployeeId { get; set; }

        [StringLength(50)]
        public string? LeaveType { get; set; }

        [Required]
        public DateTime? StartDate { get; set; }

        [Required]
        public DateTime? EndDate { get; set; }

        [StringLength(255)]
        public string? Reason { get; set; }

        [StringLength(20)]
        public string? ApprovalStatus { get; set; }

        [Required]
        public DateTime? CreatedAt { get; set; }

        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }
        
        public bool IsActive { get; set; }

        //Navigation Property
        public Employee? Employees { get; set; }
        public User? CreatedUser { get; set; }
        public User? UpdatedUser { get; set; }









    }
}
