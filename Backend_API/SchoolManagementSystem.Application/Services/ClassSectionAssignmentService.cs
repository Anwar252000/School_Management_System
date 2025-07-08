using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class ClassSectionAssignmentService : IClassSectionAssignment
    {
        private readonly IGenericRepository<ClassSectionAssignment> _classSectionAssignmentRepository;
        private readonly ISection _sectionRepository;
        private readonly ClassSectionAssignmentMapper _mapper;

        public ClassSectionAssignmentService(
            IGenericRepository<ClassSectionAssignment> genericRepository,  
            ISection sectionRepository,
            ClassSectionAssignmentMapper classSectionAssignmentMapper)

        {
            _classSectionAssignmentRepository = genericRepository;
            _mapper = classSectionAssignmentMapper;
            _sectionRepository = sectionRepository;

        }

        public async Task AddClassSectionAssignmentAsync(ClassSectionAssignmentDTO classroom)
        {
            try
            {
                var existingSection = await _sectionRepository.GetSectionByIdAsync(classroom.SectionId);

                if (existingSection == null)
                {
                    throw new KeyNotFoundException("Section not found.");
                }

                existingSection.ClassId = classroom.ClassId;
                await _sectionRepository.UpdateSectionAsync(existingSection);

                var assignments = await _classSectionAssignmentRepository.GetAllAsync(
                    include: query => query
                    .Include(a => a.Classroom)
                    .Include(a => a.Class)
                    .Include(a => a.Section)
                    .Include(a => a.Campus)
                );

                // Check if the same section is already assigned to the same classroom in the same campus
                var existingAssignment = assignments
                    .FirstOrDefault(a => a.Classroom.ClassroomId == classroom.ClassroomId &&
                                            a.Section.SectionId == classroom.SectionId &&
                                            a.Campus.CampusId == classroom.CampusId &&
                                            a.IsActive);

                if (existingAssignment != null)
                {
                    throw new Exception("The section is already assigned to the classroom in the current campus.");
                }
                // Get all assignments for the same classroom
                var classroomAssignments = assignments
                    .Where(a => a.Classroom.ClassroomId == classroom.ClassroomId)
                    .ToList();

                // Check if any assignments exist for the classroom
                if (classroomAssignments.Any())
                {
                    // Calculate total section capacity for the current campus
                    var sameCampusAssignments = classroomAssignments
                        .Where(a => a.Campus.CampusId == classroom.CampusId && a.IsActive)
                        .ToList();

                    var classroomCapacity = classroomAssignments
                        .Select(a => a.Classroom.Capacity)
                        .FirstOrDefault();

                    var section = await _sectionRepository.GetSectionByIdAsync(classroom.SectionId.GetValueOrDefault());
                    var newSectionCapacity = section?.Capacity ?? 0;

                    var existingSectionCapacity = sameCampusAssignments.Sum(s => s.Section.Capacity);

                    var totalSectionCapacity = newSectionCapacity + existingSectionCapacity;

                    // If the capacity is exceeded only on the current campus
                    if (totalSectionCapacity > classroomCapacity)
                    {
                        throw new Exception("Classroom capacity exceeded on the current campus. Cannot assign more sections.");
                    }
                }

                // If no capacity issue, proceed to add assignment
                var model = _mapper.MapToEntity(classroom);
                await _classSectionAssignmentRepository.AddAsync(model);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public async Task DeleteClassSectionAssignmentAsync(int assignmentId)
        {
            var result = await _classSectionAssignmentRepository.GetByIdAsync(assignmentId);
            if (result != null)
            {
                result.IsActive = false;
                await _classSectionAssignmentRepository.UpdateAsync(result);
            }
        }

        public async Task<List<ClassSectionAssignmentDTO>> GetAllClassesAssignmentAsync()
        {
            var classAssignment = await _classSectionAssignmentRepository.GetAllAsync(
                include: query => query
                .Include(cl => cl.Classroom)
                .Include(c => c.Class)
                .Include(s => s.Section)
                .Include(s => s.Campus),
                filter: c => c.IsActive);

            var classAssignmentDtos = classAssignment.Select(c => _mapper.MapToDto(c)).ToList();

            return classAssignmentDtos;
        }

        public async Task UpdateClassSectionAssignmentAsync(ClassSectionAssignmentDTO dto)
        {
            try
            {
                var assignments = await _classSectionAssignmentRepository.GetAllAsync(
                    include: query => query
                    .AsNoTracking()
                    .Include(a => a.Classroom)
                    .Include(a => a.Class)
                    .Include(a => a.Section)
                    .Include(a => a.Campus)
                );

                // Check if the same section is already assigned to the same classroom in the same campus
                var existingAssignment = assignments
                    .FirstOrDefault(a => a.Classroom.ClassroomId == dto.ClassroomId &&
                                         a.Section.SectionId == dto.SectionId &&
                                         a.Campus.CampusId == dto.CampusId &&
                                         a.IsActive &&
                                         a.AssignmentId != dto.AssignmentId); // Exclude the current assignment

                if (existingAssignment != null)
                {
                    throw new Exception("The section is already assigned to the classroom in the current campus.");
                }

                var classroomAssignments = assignments
                    .Where(a => a.Classroom.ClassroomId == dto.ClassroomId && a.Campus.CampusId == dto.CampusId && a.IsActive)
                    .ToList();

                var sameCampusAssignments = classroomAssignments
                    .Where(a => a.IsActive)
                    .ToList();

                var classroomCapacity = classroomAssignments
                    .Select(a => a.Classroom.Capacity)
                    .FirstOrDefault();

                var section = await _sectionRepository.GetSectionByIdAsync(dto.SectionId.GetValueOrDefault());
                var newSectionCapacity = section?.Capacity ?? 0;

                var existingSectionCapacity = sameCampusAssignments
                    //.Where(a => a.ClassSectionAssignmentId != dto.ClassSectionAssignmentId) // Exclude the existing assignment being updated
                    .Sum(a => a.Section.Capacity);

                var totalSectionCapacity = newSectionCapacity + existingSectionCapacity;

                if (totalSectionCapacity > classroomCapacity)
                {
                    throw new Exception("Classroom capacity exceeded on the current campus. Cannot assign more sections.");
                }

                var model = _mapper.MapToEntity(dto);
                await _classSectionAssignmentRepository.UpdateAsync(model);

            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while updating the class section assignment.", ex);
            }
        }


        Task<ClassSectionAssignment> IClassSectionAssignment.GetClassSectionAssignmentByIdAsync(int classroomId)
        {
            throw new NotImplementedException();
        }
    }
}
