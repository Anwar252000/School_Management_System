using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class PaymentService : IPayment
    {
        private readonly IGenericRepository<Payment> _paymentRepository;
        private readonly PaymentMapper _mapper;


        public PaymentService(IGenericRepository<Payment> genericRepository, PaymentMapper paymentMapper)
        {
            _paymentRepository = genericRepository;
            _mapper = paymentMapper;

        }

        public async Task AddPaymentAsync(PaymentDTO dto)
        {
            try
            {
                var model = _mapper.MapToEntity(dto);
                await _paymentRepository.AddAsync(model);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeletePaymentAsync(int paymentId)
        {
            try
            {
                var payments = await _paymentRepository.GetByIdAsync(paymentId);
                if (payments != null)
                {
                    payments.IsActive = false;
                    await _paymentRepository.UpdateAsync(payments);
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<List<PaymentDTO>> GetAllPaymentAsync()
        {
            try
            {
                var payments = await _paymentRepository.GetAllAsync(
                    include: query => query.Include(x => x.Sponsorship).ThenInclude(x => x.Sponsor)
                    .Include(s => s.Sponsorship)
                    //.ThenInclude(s => s.Student)

                    );
                var activePayments = payments.Where(c => c.IsActive);
                var paymentDtos = activePayments.Select(c => _mapper.MapToDto(c)).ToList();

                return paymentDtos;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task UpdatePaymentAsync(PaymentDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _paymentRepository.UpdateAsync(model);

        }

    }
}
