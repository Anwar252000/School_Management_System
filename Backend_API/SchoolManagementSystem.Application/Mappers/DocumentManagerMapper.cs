//using SchoolManagementSystem.Application.DTOs;
//using SchoolManagementSystem.Application.Mappers;
//using SchoolManagementSystem.Domain.Entities;

//public class DocumentManagerMapper : IMapper<DocumentManagerDTO, DocumentManager>
//{
//    public async Task<DocumentManager> MapToEntity(DocumentManagerDTO dto)
//    {
//        var entity = new DocumentManager
//        {
//            DocumentManagerId = dto.DocumentManagerId,
//            DocumentTitle = dto.DocumentTitle,
//            DocumentType = dto.FormFile?.ContentType,
//            CreatedBy = dto.CreatedBy,
//            UpdatedBy = dto.UpdatedBy,
//            UpdatedAt = DateTime.UtcNow,
//            IsActive = dto.IsActive
//        };

//        if (dto.FormFile != null)
//        {
//            using var ms = new MemoryStream();
//            await dto.FormFile.CopyToAsync(ms);
//            entity.FilePath = ms.ToArray();
//        }

//        return entity;
//    }

//    public DocumentManagerDTO MapToDto(DocumentManager entity)
//    {
//        return new DocumentManagerDTO
//        {
//            DocumentManagerId = entity.DocumentManagerId,
//            DocumentTitle = entity.DocumentTitle,
//            DocumentType = entity.DocumentType,

//            CreatedBy = entity.CreatedBy,
//            UpdatedBy = entity.UpdatedBy,
//            IsActive = entity.IsActive
//        };
//    }


//    public List<DocumentManager> MapToEntities(DocumentManagerDTO dto)
//    {
//        throw new NotImplementedException();
//    }

//    public List<DocumentManager> MapToEntities(IEnumerable<DocumentManagerDTO> dto)
//    {
//        throw new NotImplementedException();
//    }
//}
