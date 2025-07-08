public class TimeTableViewDTO
{
    public int TimetableId { get; set; }
    public string DayOfWeek { get; set; }

    public int CampusId { get; set; }
    public string CampusName { get; set; }
    public int ClassId { get; set; }
    public string ClassName { get; set; }
    public int SubjectId { get; set; }
    public string SubjectName { get; set; }

    public int PeriodId { get; set; }
    public string PeriodName { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
}