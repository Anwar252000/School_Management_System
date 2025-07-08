using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Entities.Fee;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class FeeVoucherService : IFeeVoucher
    {
        private readonly IGenericRepository<FeeVoucher> _feeRepository;
        private readonly FeeVoucherMapper _mapper;

        public FeeVoucherService(IGenericRepository<FeeVoucher> genericRepository, FeeVoucherMapper feeVoucherMapper)
        {
            _feeRepository = genericRepository;
            _mapper = feeVoucherMapper;
        }

        public async Task AddFeeVoucherAsync(FeeVoucherDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _feeRepository.AddAsync(model);
        }

        public async Task DeleteFeeVoucherAsync(int feeVoucherId)
        {
            var FeeVoucher = await _feeRepository.GetByIdAsync(feeVoucherId);
            if (FeeVoucher != null)
            {
                FeeVoucher.IsActive = false;
                await _feeRepository.UpdateAsync(FeeVoucher);
            }
        }

        public async Task<List<FeeVoucherDTO>> GetAllFeeVouchersAsync()
        {
            var feeVoucher = await _feeRepository.GetAllAsync();
            var activeFeeVoucher = feeVoucher.ToList();
            var result = activeFeeVoucher.Select(e => _mapper.MapToDto(e)).ToList();
            return result;
        }

        public async Task<FeeVoucherDTO> GetFeeVoucherByIdAsync(int feeVoucherId)
        {
            var result = await _feeRepository.GetByIdAsync(feeVoucherId);
            return _mapper.MapToDto(result);
        }

        public async Task UpdateFeeVoucherAsync(FeeVoucherDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _feeRepository.UpdateAsync(model);
        }

    }
}
