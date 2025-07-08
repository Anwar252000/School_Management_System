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
import PeriodsListTable from "./periods-table";
import AddPeriods from "./add-periods";
import { PeriodData } from "@/services/apis/periodService";


export default function ViewPeriod({
  periods,
  refetch,
}: {
  periods: PeriodData[];
  refetch: () => void;
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
          <SheetTitle>Class Periods</SheetTitle>
        </SheetHeader>
        <div className="flex flex-row-reverse">
          <AddPeriods refetch={refetch} />
        </div>
        <div className="py-6">
          <PeriodsListTable Periods={periods} refetch={refetch} />
        </div>
        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
