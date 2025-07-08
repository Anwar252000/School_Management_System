using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolManagementSystem.Domain.Entities
{
    public class AdmissionTest
    {
        [Key]
        public int TestId { get; set; }

        [Required]
        public int ApplicationId { get; set; }

        public DateTime TestDate { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal TestScore { get; set; }

        [MaxLength(50)]
        public string TestResult { get; set; }  // e.g., "Pass", "Fail"

        // Navigation Property
        [ForeignKey("ApplicationId")]
        public virtual AdmissionApplication Application { get; set; }
    }
}
