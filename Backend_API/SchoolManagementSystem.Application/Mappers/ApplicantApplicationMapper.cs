using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class ApplicantApplicationMapper : IMapper<ApplicantApplicationViewDTO, ApplicantApplicationView>
    {
        public ApplicantApplicationViewDTO MapToDto(ApplicantApplicationView entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            return new ApplicantApplicationViewDTO
            {

                ApplicationId = entity.ApplicationId,
                ApplicationStatus = entity.ApplicationStatus,
                CampusId = entity.CampusId,
                CampusName = entity.CampusName,
                AppliedClassId = entity.AppliedClassId,
                AppliedClassName = entity.AppliedClassName,
                ApplicantId = entity.ApplicantId,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                LastAttendedClassName = entity.LastClassName,
                LastClassId = entity.LastClassId,
                DateOfBirth = entity.DateOfBirth,
                FormBNumber = entity.FormBNumber,
                Gender = entity.Gender,
                AdmissionDecisionDate = entity.AdmissionDecisionDate,
                Remarks = entity.Remarks,
                PhoneNumber = entity.PhoneNumber,
                Email = entity.Email,
                ParentAddress = entity.ParentAddress,
                MotherTongue = entity.MotherTongue,
                ResidenceStatus = entity.ResidenceStatus,
                Occupation = entity.Occupation,
                SourceOfIncome = entity.SourceOfIncome,
                Dependent = entity.Dependent,
                ParentFirstName = entity.ParentFirstName,
                ParentMiddleName = entity.ParentMiddleName,
                ParentLastName = entity.ParentLastName,
                Nationality = entity.Nationality
            };
        }

        public List<ApplicantApplicationView> MapToEntities(ApplicantApplicationViewDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<ApplicantApplicationView> MapToEntities(IEnumerable<ApplicantApplicationViewDTO> dto)
		{
			throw new NotImplementedException();
		}

		public ApplicantApplicationView MapToEntity(ApplicantApplicationViewDTO dto)
        {
            if (dto == null)
            {
                throw new ArgumentNullException(nameof(dto));
            }

            return new ApplicantApplicationView
            {
                ApplicationId = dto.ApplicationId,
                ApplicationStatus = dto.ApplicationStatus,
                CampusId = dto.CampusId,
                CampusName = dto.CampusName,
                AppliedClassId = dto.AppliedClassId,
                AppliedClassName = dto.AppliedClassName,
                ApplicantId = dto.ApplicantId,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                LastClassName = dto.LastAttendedClassName,
                LastClassId = dto.LastClassId,
                DateOfBirth = dto.DateOfBirth,
                FormBNumber = dto.FormBNumber,
                Gender = dto.Gender,
                AdmissionDecisionDate = dto.AdmissionDecisionDate,
                Remarks = dto.Remarks,
                ParentFirstName = dto.ParentFirstName,
                ParentMiddleName = dto.ParentMiddleName,
                ParentLastName = dto.ParentLastName,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                ParentAddress = dto.ParentAddress,
                MotherTongue = dto.MotherTongue,
                ResidenceStatus = dto.ResidenceStatus,
                Occupation = dto.Occupation,
                SourceOfIncome = dto.SourceOfIncome,
                Dependent = dto.Dependent,
                Nationality = dto.Nationality

            };
        }
    }
}
