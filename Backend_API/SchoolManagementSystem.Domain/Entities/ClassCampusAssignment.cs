using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Domain.Entities
{
    public class ClassCampusAssignment
    {
        [Key]
        public int AssignmentId { get; set; }

        [ForeignKey("Class")]
        public int ClassId { get; set; }

        [ForeignKey("Campus")]
        public int CampusId { get; set; }

        // Navigation properties
        public Class Class { get; set; }
        public Campus Campus { get; set; }
    }
}
