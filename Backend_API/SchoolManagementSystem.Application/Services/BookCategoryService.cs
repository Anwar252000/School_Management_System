using SchoolManagementSystem.Application.DTOs.Library;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;
using SchoolManagementSystem.Domain.Entities.Library;
using SchoolManagementSystem.Domain.Interfaces;

namespace SchoolManagementSystem.Application.Services
{
    public class BookCategoryService : IBookCategory
    {
        private readonly IGenericRepository<BookCategory> _categoryRepository;
        private readonly BookCategoryMapper _mapper;

        public BookCategoryService(IGenericRepository<BookCategory> categoryRepository, BookCategoryMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        public async Task AddCategoryAsync(BookCategoryDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _categoryRepository.AddAsync(model);
        }

        public async Task DeleteCategoryAsync(int id)
        {
            var entity = await _categoryRepository.GetByIdAsync(id);
            if (entity != null)
            {
                entity.IsActive = false;
                await _categoryRepository.UpdateAsync(entity);
            }
        }

        public async Task<List<BookCategoryDTO>> GetAllCategoryAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();
            return categories.Where(x => x.IsActive).Select(x => _mapper.MapToDto(x)).ToList();
        }

        public async Task UpdateCategoryAsync(BookCategoryDTO dto)
        {
            var model = _mapper.MapToEntity(dto);
            await _categoryRepository.UpdateAsync(model);
        }
    }
}
