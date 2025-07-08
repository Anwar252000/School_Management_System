using SchoolManagementSystem.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SchoolManagementSystem.Application.DTOs
{
    public class SponsorDTO
    {
        public int SponsorId { get; set; }

        public string SponsorName { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public string Gender { get; set; }

        public string Occupation { get; set; }

        public string Country { get; set; }

        public string State { get; set; }

        public string City { get; set; }

        public int PostalCode { get; set; }

        public string Address { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public int? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public int? UpdatedBy { get; set; }

        public bool IsActive { get; set; } = true;

    }
}
