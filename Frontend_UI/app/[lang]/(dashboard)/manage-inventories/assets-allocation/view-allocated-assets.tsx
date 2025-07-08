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
import { AssetAllocationData } from "@/services/apis/assetsAllocationService";
import AllocatedAssetsTable from "./allocated-assets-table";
import { InventoryItemData } from "@/services/apis/inventoryItemService";
import { InventoryStatusData } from "@/services/apis/inventoryStatusService";

export default function ViewAllocatedAssets({
  allocatedAssets,
  items,
  status,
}: {
  allocatedAssets: AssetAllocationData[] | null;
  items: InventoryItemData[] | null;
  status: InventoryStatusData[] | null;
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
          <SheetTitle>Allocated Assets</SheetTitle>
        </SheetHeader>
        <div>
          <div className="py-6">
            <AllocatedAssetsTable
              allocatedAssets={allocatedAssets as AssetAllocationData[]}
              items={items as InventoryItemData[]}
              status={status as InventoryStatusData[]}
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
