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
import CategoryListTable from "./status-table";
import { InventoryStatusData } from "@/services/apis/inventoryStatusService";
import StatusListTable from "./status-table";

// This component allows you to view class details in a sheet.
export default function ViewStatuses({
  status,
}: {
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
          <SheetTitle>Inventory Categories</SheetTitle>
        </SheetHeader>
        <div>
          <div className="py-6">
            <StatusListTable statuses={status as InventoryStatusData[]} />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
