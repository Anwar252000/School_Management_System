namespace SchoolManagementSystem.Domain.Entities
{
    public class InventoryStockView
    {
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public string CategoryName { get; set; }
        public int TotalStockIn { get; set; }
        public int TotalStockOut { get; set; }
        public int CurrentStock { get; set; }

    }

}
