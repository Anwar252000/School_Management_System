using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Enums.Notice;
using SchoolManagementSystem.Domain.Interfaces;
using SchoolManagementSystem.Infrastructure;
using SchoolManagementSystem.Infrastructure.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class NoticeService : INoticeService
    {
        private readonly IGenericRepository<Notice> _noticesRepository;
        private readonly NoticeMapper _noticeMapper;
        private readonly IEmailService _emailService;
        private readonly IGenericRepository<Parent> _parentRepository;
        private readonly IGenericRepository<Student> _studentRepository;
        private readonly IGenericRepository<Employee> _employeeRepository;

        public NoticeService(
            IGenericRepository<Notice> noticesRepository,
            NoticeMapper noticeMapper,
            IEmailService emailService,
            IGenericRepository<Parent> parentRepository,
            IGenericRepository<Student> studentRepository,
            IGenericRepository<Employee> employeeRepository
            )
        {
            _noticesRepository = noticesRepository;
            _noticeMapper = noticeMapper;
            _emailService = emailService;
            _parentRepository = parentRepository;
            _studentRepository = studentRepository;
            _employeeRepository = employeeRepository;
        }

        public async Task SendNotice(NoticeDto noticeDto)
        {
            try
            {
                var entity = _noticeMapper.MapToEntity(noticeDto);

                if (entity.Method == Method.Email)
                {
                    // Recipients will be fetched from contact book except for custom Recipient Type
                    // Recipients either come from contact book or any other source
                    var recipients = new List<string>();

                    await _noticesRepository.AddAsync(entity);
                    if (entity.RecipientType == RecipientType.General)
                    {
                        var parents = await _parentRepository.GetAllAsync();
                        recipients.AddRange(parents.Select(p => p.Email).Where(email => !string.IsNullOrEmpty(email)).ToList());

                        var employees = await _employeeRepository.GetAllAsync();
                        recipients.AddRange(employees.Select(e => !string.IsNullOrEmpty(e.Email) ? e.Email : "").Where(email => !string.IsNullOrEmpty(email)).ToList());
                    }
                    else if (entity.RecipientType == RecipientType.Parent)
                    {
                        var parents = await _parentRepository.GetAllAsync();
                        recipients = parents.Select(p => p.Email).Where(email => !string.IsNullOrEmpty(email)).ToList();
                    }
                    else if (entity.RecipientType == RecipientType.Student && noticeDto.SelectedClasses?.Length > 0)
                    {
                        //var students = await _studentRepository.FindAllAsync(s => noticeDto.SelectedClasses.ToList().Contains(s.Academic.Class.ClassId.ToString()) , s => s.Academic.);
                        //var students = await _parentRepository.FindAllAsync(p => noticeDto.SelectedClasses.ToList().Contains(s.Academic.Class.ClassId.ToString()) , p => p.);
                        //recipients = students.Select(s => )
                        throw new NotImplementedException();
                    }
                    else if (entity.RecipientType == RecipientType.Teacher)
                    {
                        var teachers = await _employeeRepository.FindAllAsync(e => e.EmployeeRole.RoleName.ToLower() == "teacher", e => e.EmployeeRole);
                        recipients = teachers.Select(t => !string.IsNullOrEmpty(t.Email) ? t.Email : "").Where(email => !string.IsNullOrEmpty(email)).ToList();
                    }

                    if (recipients.Any())
                    {
                        var message = new Message(recipients, noticeDto.Title, noticeDto.Content); // Content can be wrapped in html for sending formatted email

                        await _emailService.SendEmailAsync(message);
                    }
                    else
                    {
                        throw new Exception("Recipients are not defined");
                    }
                }
                else
                {
                    throw new NotImplementedException($"{entity.Method} is not implemeted yet.");
                }

            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<NoticeDto>> Get()
        {
            var result = await _noticesRepository.GetAllAsync();

            return result.Select(notice => _noticeMapper.MapToDto(notice)).ToList();
        }
    }
}
