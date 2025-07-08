import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SelectionOperation from "./table-selection-operation";
import { CampusData } from "@/services/apis/campusService";

export default function ViewDepartment({ campus, refetch }: { campus: CampusData, refetch: () => void }) {
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
          <SheetTitle>Department</SheetTitle>
          <SheetDescription>Campus - {campus?.campusName}</SheetDescription>
        </SheetHeader>
        <div>
          <div className="py-6">
            <SelectionOperation campus={campus} refetch={refetch} />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
