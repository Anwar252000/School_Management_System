namespace SchoolManagementSystem.Application.DTOs
{
    public class ApplicantApplicationViewDTO
    {
        // Application Details
        public int ApplicationId { get; set; }
        public int ApplicantId { get; set; }
        public string ApplicationStatus { get; set; }
        public int CampusId { get; set; }
        public string CampusName { get; set; }
        public DateOnly? AdmissionDecisionDate { get; set; }
        public string? Remarks { get; set; }

        // Applied Class Details
        public int AppliedClassId { get; set; }
        public string AppliedClassName { get; set; }

        // Last Attended Class Details
        public int LastClassId { get; set; }
        public string LastAttendedClassName { get; set; }

        // Applicant Personal Details
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FormBNumber { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string Gender { get; set; }

        // Parents Details


        public string? ParentFirstName { get; set; }
        public string? ParentMiddleName { get; set; }
        public string? ParentLastName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? Occupation { get; set; }
        public string? SourceOfIncome { get; set; }
        public string? Dependent { get; set; }
        public string? MotherTongue { get; set; }
        public string? ParentAddress { get; set; }
        public string? ResidenceStatus { get; set; }
        public string? Nationality { get; set; }

    }
}
