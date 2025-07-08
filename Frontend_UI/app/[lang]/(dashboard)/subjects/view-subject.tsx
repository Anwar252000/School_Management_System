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
import SubjectListTable from "./subject-table";
import { SubjectData } from "@/services/apis/subjectService";

// This component allows you to view class details in a sheet.
export default function ViewSubject({
  subject,
  refetch
}: {
  subject: SubjectData[] | null;
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
          <SheetTitle>Subject</SheetTitle>
        </SheetHeader>
        <div>
          <div className="py-6">
            <SubjectListTable subject={subject ?? []} refetch ={refetch}/>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
