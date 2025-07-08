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
import SectionListTable from "./section-table";
import { SectionData } from "@/services/apis/sectionService";
import { ClassData } from "@/services/apis/classService";

export default function ViewSection({
  selectedSection,
  selectedClass,
}: {
  selectedSection: SectionData[] | null;
  selectedClass: ClassData[] | null;
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
          <SheetTitle>Sections</SheetTitle>
          {/* <SheetDescription>Class Name - {classes.className}</SheetDescription> */}
        </SheetHeader>
        <div>
          <div className="py-6">
            <SectionListTable/>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
