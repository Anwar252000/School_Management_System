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
import ClassListTable from "./fee-category-table";
import { FeeCategoryData } from "@/services/apis/feeCategoryService";
import FeeCategoryListTable from "./fee-category-table";

export default function ViewFeeCategories({
  selectedFeeCategory,
}: {
  selectedFeeCategory: FeeCategoryData[] | null;
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
          <SheetTitle>Fee Category</SheetTitle>
        </SheetHeader>
        <div>
          <div className="py-6">
            <FeeCategoryListTable />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
