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
import { InventoryPurchaseData } from "@/services/apis/inventoryPurchaseService";
import PurchaseListTable from "./purchase-table";
import { InventoryItemData } from "@/services/apis/inventoryItemService";

export default function ViewPurchases({
  selectedPurchase,
  items,
}: {
  selectedPurchase: InventoryPurchaseData[] | null;
  items: InventoryItemData[];
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
          <SheetTitle>Inventory Purchases</SheetTitle>
        </SheetHeader>
        <div>
          <div className="py-6">
            <PurchaseListTable
              purchases={selectedPurchase as InventoryPurchaseData[]}
              items={items}
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
