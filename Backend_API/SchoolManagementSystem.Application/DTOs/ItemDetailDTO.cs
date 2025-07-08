using SchoolManagementSystem.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Application.DTOs
{
    public class ItemDetailDTO
    {
        public int ItemDetailId { get; set; }

        public int? ItemId { get; set; }

        public int StatusId { get; set; }

        public string? ItemName { get; set; }
        public string? CategoryName { get; set; }
        public string? StatusName { get; set; }
        public string? TagNumber { get; set; }

        public bool? IsActive { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }

    }
}
