using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolManagementSystem.Application.DTOs
{
    public class RegisterDTO
    {
        public string UserName { get; set; }
        public string PasswordHash { get; set; }

        [ForeignKey("UserRole")]
        public int RoleId { get; set; }

        [ForeignKey("Campus")]
        public int CampusId { get; set; }

        [Required]
        public bool IsActive { get; set; }
    }
}
