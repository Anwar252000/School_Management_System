using SchoolManagementSystem.Application.DTOs.Fee;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IFeeService
    {
        Task AssignFeesToStudentsAsync();
        Task ApplyDiscountAsync(int studentId, decimal discountAmount, string reason, int createdBy);
        Task<List<StudentFeeDto>> GetStudentFeesAsync();
        Task<List<FeeViewDTO>> GetAllStudentFeeAsync();

    }

}
