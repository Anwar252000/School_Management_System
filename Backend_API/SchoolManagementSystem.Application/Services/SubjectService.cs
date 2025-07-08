using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class SubjectService : ISubject
    {
        private readonly IGenericRepository<Subject> _subjectRepository;
        private readonly SubjectMapper _mapper;


        public SubjectService(IGenericRepository<Subject> genericRepository, SubjectMapper subjectMapper)
        {
            _subjectRepository = genericRepository;
            _mapper = subjectMapper;
        }

        public async Task AddSubjectAsync(SubjectDTO sub)
        {
            try
            {

                var model = _mapper.MapToEntity(sub);
                await _subjectRepository.AddAsync(model);
            }
            catch (Exception)
            {

                throw;
            }

        }

        public async Task DeleteSubjectAsync(int subjectId)
        {
            try
            {
                var subject = await _subjectRepository.GetByIdAsync(subjectId);
                if (subject != null)
                {
                    subject.IsActive = false;
                    await _subjectRepository.UpdateAsync(subject);
                }
            }
            catch (Exception)
            {

                throw;
            }

        }

        public async Task<List<SubjectDTO>> GetAllSubjectAsync()
        {
            var subject = await _subjectRepository.GetAllAsync();
            var activeSubject = subject.Where(c => c.IsActive);

            // Map the entities to DTOs
            var subjectDTOs = activeSubject.Select(c => _mapper.MapToDto(c)).ToList();

            return subjectDTOs;
        }

        public async Task<SubjectDTO> GetSubjectByIdAsync(int subId)
        {
            throw new NotImplementedException();
        }

        public async Task UpdateSubjectAsync(SubjectDTO sub)
        {
            try
            {
                var model = _mapper.MapToEntity(sub);
                await _subjectRepository.UpdateAsync(model);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
