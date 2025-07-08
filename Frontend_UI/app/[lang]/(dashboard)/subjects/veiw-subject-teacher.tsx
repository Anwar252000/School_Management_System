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
import SubjectTeacherTable from "./table-subject-teacher";
import { SubjectTeacherData } from "@/services/apis/assignSubjectTeacherService";
import { SubjectData } from "@/services/apis/subjectService";
import { EmployeesData } from "@/services/apis/employeeService";
import { useEffect } from "react";

export default function ViewSubjectTeacher({
  subjectTeacherData,
  subject,
  employee,
  refetch,
}: {
  subjectTeacherData: SubjectTeacherData[];
  subject: SubjectData[];
  employee: EmployeesData[] | null;
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
          <SheetTitle>Subject Teacher</SheetTitle>
        </SheetHeader>
        <div>
          <div className="py-6">
            <SubjectTeacherTable
              employee={employee ? employee : []}
              subjectTeacher={subjectTeacherData ? subjectTeacherData : []}
              subject={subject}
              refetch={refetch}
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
