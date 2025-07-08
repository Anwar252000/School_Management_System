namespace SchoolManagementSystem.Application.DTOs.Fee
{
    public class StudentFeeDto
    {
        public int StudentId { get; set; }
        public string FullName { get; set; }
        public decimal TotalDueAmount { get; set; }
    }
}
