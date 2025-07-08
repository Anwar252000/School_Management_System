using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace SchoolManagementSystem.Domain.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> filter = null,
                                      Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null);

        Task<T> GetByIdAsync(int id);
        Task<IEnumerable<T>> FindAllAsync(Expression<Func<T, bool>> predicate,
            params Expression<Func<T, object>>[] includes);

        // Find entity based on a predicate
        Task<T?> FindAsync(Expression<Func<T, bool>> predicate);
        Task<object> AddAsync(T entity);
        Task<object> UpdateAsync(T entity);
        Task<object> UpdateAsync(T entity, bool trackingOff);
        Task DeleteAsync(int id);
        Task DeleteAsync(T entity);
        Task<int> ExecuteRawSqlAsync(string sql, params object[] parameters);

    }
}
