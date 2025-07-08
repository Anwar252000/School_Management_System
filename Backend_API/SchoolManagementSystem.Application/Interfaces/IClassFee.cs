using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IClassFee
    {
        Task<List<ClassFeeDTO>> GetAllClassFeeAsync();
        Task<ClassFeeDTO> GetClassFeeByIdAsync(int? classFeeId);
        Task AddClassFeeAsync(ClassFeeDTO classFee);
        Task UpdateClassFeeAsync(ClassFeeDTO classFee);
        Task DeleteClassFeeAsync(int classFeeId);
    }
}
