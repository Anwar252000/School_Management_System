using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Mappers
{
    public class DashboardCountViewMapper : IMapper<DashboardCountViewDTO, DashboardCountView>
    {


        public DashboardCountView MapToEntity(DashboardCountViewDTO dto)
        {
            return new DashboardCountView
            {
                TotalEmployees = dto.TotalEmployees,
                TotalSponsors = dto.TotalSponsors,
                TotalStudents = dto.TotalStudents,
                NewEmployeesThisMonth = dto.NewEmployeesThisMonth,
                NewSponsorsThisMonth = dto.NewSponsorsThisMonth,
                NewStudentsThisMonth = dto.NewStudentsThisMonth,
                TotalStudentsSponsor = dto.TotalStudentsSponsor,
                NewStudentsSponsoredThisMonth = dto.NewStudentsSponsoredThisMonth,
            };
        }
        public DashboardCountViewDTO MapToDto(DashboardCountView entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            return new DashboardCountViewDTO
            {
                TotalEmployees = entity.TotalEmployees,
                TotalSponsors = entity.TotalSponsors,
                TotalStudents = entity.TotalStudents,
                NewEmployeesThisMonth = entity.NewEmployeesThisMonth,
                NewStudentsThisMonth = entity.NewStudentsThisMonth,
                NewSponsorsThisMonth = entity.NewSponsorsThisMonth,
                NewStudentsSponsoredThisMonth = entity.NewSponsorsThisMonth,
                TotalStudentsSponsor = entity.TotalStudentsSponsor,
            };
        }

        public List<DashboardCountView> MapToEntities(DashboardCountViewDTO dto)
        {
            throw new NotImplementedException();
        }

		public List<DashboardCountView> MapToEntities(IEnumerable<DashboardCountViewDTO> dto)
		{
			throw new NotImplementedException();
		}
	}
}
