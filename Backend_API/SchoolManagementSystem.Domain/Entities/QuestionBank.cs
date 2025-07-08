using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class QuestionBank
    {
        [Key]
        public int? QuestionBankId { get; set; }

        [ForeignKey("Class")]
        public int ClassId { get; set; }

        [ForeignKey("Subject")]
        public int SubjectId { get; set; }

        [Required]
        public string QuestionType { get; set; }
        [Required]
        public string Questions {  get; set; }
        [Required]
        public int Marks { get; set; }

        [Required]
        public DateTime? CreatedAt { get; set; }

        [ForeignKey("CreatedUser")]
        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UpdatedUser")]
        public int? UpdatedBy { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;

        // Navigation properties

        public User? CreatedUser { get; set; }
        public User? UpdatedUser { get; set; }
        public Class? Class { get; set; }
        public Subject? Subject { get; set; }

    }
}
