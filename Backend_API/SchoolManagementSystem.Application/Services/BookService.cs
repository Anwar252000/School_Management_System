using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Application.DTOs.Library;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities.Library;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class BookService : IBook
    {
        private readonly IGenericRepository<Book> _bookRepository;
        private readonly BookMapper _mapper;

        public BookService(IGenericRepository<Book> bookRepository, BookMapper mapper)
        {
            _bookRepository = bookRepository;
            _mapper = mapper;
        }

        public async Task AddBookAsync(BookDTO dto)
        {
            var entity = _mapper.MapToEntity(dto);
            await _bookRepository.AddAsync(entity);
        }

        public async Task DeleteBookAsync(int id)
        {
            var entity = await _bookRepository.GetByIdAsync(id);
            if (entity != null)
            {
                entity.IsActive = false;
                await _bookRepository.UpdateAsync(entity);
            }
        }

        public async Task<List<BookDTO>> GetAllBookAsync()
        {
            var books = await _bookRepository.GetAllAsync(
                include: q => q.Include(c => c.BookCategory)
            );

            return books.Where(x => x.IsActive).Select(x => _mapper.MapToDto(x)).ToList();
        }

        public async Task UpdateBookAsync(BookDTO dto)
        {
            var entity = _mapper.MapToEntity(dto);
            await _bookRepository.UpdateAsync(entity);
        }
    }
}
