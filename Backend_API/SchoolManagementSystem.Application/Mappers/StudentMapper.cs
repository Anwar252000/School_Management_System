using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class StudentMapper : IMapper<StudentDTO, Student>
    {


        public Student MapToEntity(StudentDTO dto)
        {
            return new Student
            {
                StudentId = dto.StudentId,
                GrNo = dto.GrNo,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Gender = dto.Gender,
                DateOfBirth = dto.DateOfBirth,
                EnrollmentDate = dto.EnrollmentDate,
                ProfileImage = dto.ProfileImage,
                //CampusId = dto.CampusId,
                //ClassId = dto.ClassId,
                //SectionId = dto.SectionId,
                IsActive = dto.IsActive,

            };
        }
        public StudentDTO MapToDto(Student entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            return new StudentDTO
            {
                StudentId = entity.StudentId,
                GrNo = entity.GrNo,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                Gender = entity.Gender,
                DateOfBirth = entity.DateOfBirth,
                EnrollmentDate = entity.EnrollmentDate,
                ProfileImage = entity.ProfileImage,
                CampusName = entity.Academic?.Campus?.CampusName,
                SectionId = entity.Academic?.SectionId,
                ClassId = entity.Academic.ClassId,
                SectionName = entity.Academic?.Section?.SectionName,
                ClassName = entity.Academic.Class?.ClassName,
                IsActive = entity.IsActive,


            };
        }

        public List<Student> MapToEntities(StudentDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<Student> MapToEntities(IEnumerable<StudentDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
