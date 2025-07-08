using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.Application.Interfaces
{
    public interface IPayment
    {
        Task<List<PaymentDTO>> GetAllPaymentAsync();
        Task AddPaymentAsync(PaymentDTO dto);
        Task UpdatePaymentAsync(PaymentDTO dto);
        Task DeletePaymentAsync(int paymentId);

    }
}
