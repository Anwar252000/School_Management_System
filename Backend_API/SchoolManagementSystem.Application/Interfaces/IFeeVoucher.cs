using SchoolManagementSystem.Application.DTOs;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IFeeVoucher
    {
        Task<List<FeeVoucherDTO>> GetAllFeeVouchersAsync();
        Task<FeeVoucherDTO> GetFeeVoucherByIdAsync(int feeVoucherId);
        Task AddFeeVoucherAsync(FeeVoucherDTO feeVoucher);
        Task UpdateFeeVoucherAsync(FeeVoucherDTO feeVoucher);
        Task DeleteFeeVoucherAsync(int feeVoucherId);
    }
}
