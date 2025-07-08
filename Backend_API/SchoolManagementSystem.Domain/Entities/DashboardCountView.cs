namespace SchoolManagementSystem.Domain.Entities
{
    public class DashboardCountView
    {
        public int? TotalSponsors { get; set; }
        public int? TotalEmployees { get; set; }
        public int? TotalStudents { get; set; }
        public int? NewSponsorsThisMonth { get; set; }
        public int? NewEmployeesThisMonth { get; set; }
        public int? NewStudentsThisMonth { get; set; }
        public int? TotalStudentsSponsor { get; set; }
        public int? NewStudentsSponsoredThisMonth { get; set; }

    }
}
