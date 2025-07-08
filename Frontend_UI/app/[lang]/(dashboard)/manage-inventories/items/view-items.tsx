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
import ItemListTable from "./item-table";
import { InventoryItemData } from "@/services/apis/inventoryItemService";
import { InventoryCategoryData } from "@/services/apis/inventoryCategoryService";
import { InventoryStatusData } from "@/services/apis/inventoryStatusService";

// This component allows you to view class details in a sheet.
export default function ViewItems({
  selectedItem,
  categories,
  status,
}: {
  selectedItem: InventoryItemData[] | null;
  categories: InventoryCategoryData[];
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
            <ItemListTable
              items={selectedItem as InventoryItemData[]}
              categories={categories}
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
