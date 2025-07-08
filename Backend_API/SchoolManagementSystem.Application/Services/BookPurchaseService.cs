using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs.Library;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities.Library;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class BookPurchaseService : IBookPurchase
    {
        private readonly IGenericRepository<BookPurchase> _purchaseRepository;
        private readonly BookPurchaseMapper _mapper;

        public BookPurchaseService(IGenericRepository<BookPurchase> purchaseRepository, BookPurchaseMapper mapper)
        {
            _purchaseRepository = purchaseRepository;
            _mapper = mapper;
        }

        public async Task AddPurchaseAsync(BookPurchaseDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _purchaseRepository.AddAsync(model);
        }

        public async Task DeletePurchaseAsync(int id)
        {
            var item = await _purchaseRepository.GetByIdAsync(id);
            if (item != null)
            {
                item.IsActive = false;
                await _purchaseRepository.UpdateAsync(item);
            }
        }

        public async Task<List<BookPurchaseDTO>> GetAllPurchaseAsync()
        {
            var result = await _purchaseRepository.GetAllAsync(include: query => query.Include(b => b.Book));
            var active = result.Where(x => x.IsActive).Select(x => _mapper.MapToDto(x)).ToList();
            return active;
        }

        public async Task UpdatePurchaseAsync(BookPurchaseDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _purchaseRepository.UpdateAsync(model);
        }
    }
}
