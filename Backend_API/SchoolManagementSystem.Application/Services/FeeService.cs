using SchoolManagementSystem.Application.DTOs.Fee;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Entities.Fee;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class FeeService : IFeeService
    {
        private readonly IGenericRepository<Student> _studentRepository;
        private readonly IGenericRepository<ClassFee> _classFeeRepository;
        private readonly IGenericRepository<FeeVoucher> _feeVoucherRepository;
        private readonly IGenericRepository<FeeAdjustment> _feeAdjustmentRepository;
        private readonly IGenericRepository<FeeView> _feeViewRepository;
        private readonly FeeViewMapper _feeViewMapper;


        public FeeService(
            IGenericRepository<Student> studentRepository,
            IGenericRepository<ClassFee> classFeeRepository,
            IGenericRepository<FeeVoucher> feeVoucherRepository,
            IGenericRepository<FeeAdjustment> feeAdjustmentRepository,
            IGenericRepository<FeeView> feeViewRepository,
            FeeViewMapper feeViewMapper

            )
        {
            _studentRepository = studentRepository;
            _classFeeRepository = classFeeRepository;
            _feeVoucherRepository = feeVoucherRepository;
            _feeAdjustmentRepository = feeAdjustmentRepository;
            _feeViewRepository = feeViewRepository;
            _feeViewMapper = feeViewMapper;
        }

        public async Task AssignFeesToStudentsAsync()
        {
            var students = await _studentRepository.GetAllAsync();
            foreach (var student in students)
            {
                var classFees = await _classFeeRepository.GetAllAsync(cf => cf.ClassId == student.Academic.ClassId && cf.CampusId == student.Academic.CampusId);
                var totalAmount = classFees.Sum(cf => cf.Amount);

                var feeVoucher = new FeeVoucher
                {
                    StudentId = student.StudentId,
                    CampusId = (int)student.Academic.CampusId,
                    FeeMonth = DateTime.UtcNow.ToString("MMMM"),
                    FeeYear = DateTime.UtcNow.Year,
                    TotalAmount = (decimal)totalAmount,
                    DueDate = DateTime.UtcNow.AddDays(30),
                    Paid = false,
                    CreatedAt = DateTime.UtcNow
                };
                await _feeVoucherRepository.AddAsync(feeVoucher);
            }
        }

        public async Task ApplyDiscountAsync(int studentId, decimal discountAmount, string reason, int createdBy)
        {
            var vouchers = await _feeVoucherRepository.FindAllAsync(v => v.StudentId == studentId && !v.Paid);
            var voucher = vouchers.FirstOrDefault(x => x.StudentId == studentId);
            if (voucher == null) throw new Exception("No unpaid fee voucher found for the student.");

            var adjustment = new FeeAdjustment
            {
                StudentId = studentId,
                VoucherId = voucher.VoucherId,
                AdjustmentAmount = discountAmount,
                Reason = reason,
                AdjustmentDate = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = createdBy
            };

            await _feeAdjustmentRepository.AddAsync(adjustment);
            voucher.TotalAmount -= discountAmount;
            await _feeVoucherRepository.UpdateAsync(voucher);
        }

        public async Task<List<StudentFeeDto>> GetStudentFeesAsync()
        {
            var students = await _studentRepository.GetAllAsync();
            var studentFees = new List<StudentFeeDto>();

            foreach (var student in students)
            {
                var vouchers = await _feeVoucherRepository.GetAllAsync(v => v.StudentId == student.StudentId);
                var totalDue = vouchers.Where(v => !v.Paid).Sum(v => v.TotalAmount);

                studentFees.Add(new StudentFeeDto
                {
                    StudentId = student.StudentId,
                    FullName = student.FirstName + " " + student.LastName,
                    TotalDueAmount = totalDue
                });
            }

            return studentFees;
        }

        public async Task<List<FeeViewDTO>> GetAllStudentFeeAsync()
        {
            var feeEntities = await _feeViewRepository.GetAllAsync();
            var lst = feeEntities.ToList();
            var result = new List<FeeViewDTO>();

            lst.ForEach(x => result.Add(_feeViewMapper.MapToDto(x)));

            return result;

        }

    }
}
