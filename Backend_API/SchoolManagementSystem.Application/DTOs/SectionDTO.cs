namespace SchoolManagementSystem.Domain.Entities
{
    public class SectionDTO
    {
        public int SectionId { get; set; }
        public string SectionName { get; set; }
        public int? ClassId { get; set; }
        public int? Capacity { get; set; }
        public int CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
