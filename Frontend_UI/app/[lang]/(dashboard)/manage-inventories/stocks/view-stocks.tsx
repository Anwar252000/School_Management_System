import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { InventoryStockData } from "@/services/apis/inventoryStockService";
import StockListTable from "./stock-table";
import { InventoryItemData } from "@/services/apis/inventoryItemService";
import { InventoryStatusData } from "@/services/apis/inventoryStatusService";

// This component allows you to view class details in a sheet.
export default function ViewStocks({
  selectedStocks,
  items,
  status,
}: {
  selectedStocks: InventoryStockData[] | null;
  items: InventoryItemData[];
  status: InventoryStatusData[];
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-transparent text-xs hover:text-default-800 px-1"
        >
          View List
        </Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Inventory Items</SheetTitle>
        </SheetHeader>
        <div>
          <div className="py-6">
            <StockListTable
              stocks={selectedStocks as InventoryStockData[]}
              items={items}
              status={status}
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
