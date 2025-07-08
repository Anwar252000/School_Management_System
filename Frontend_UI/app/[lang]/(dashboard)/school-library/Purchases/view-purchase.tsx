"use client";

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
import { BookPurchaseData } from "@/services/apis/bookPurchaseService";
import PurchaseTable from "./purchase-table";
import { BookCategoryData } from "@/services/apis/bookCategoryService";

interface ViewPurchaseProps {
  selectedPurchase: BookPurchaseData[] | null;
}

const ViewPurchase: React.FC<ViewPurchaseProps> = ({ selectedPurchase }) => {
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
          <SheetTitle>Library Purchases</SheetTitle>
        </SheetHeader>
        <div className="py-6">
          <PurchaseTable purchases={selectedPurchase ?? []} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ViewPurchase;
