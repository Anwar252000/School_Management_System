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
import QuestionsTable from "./questions-table";
import { QuestionsData } from "@/services/apis/qBankService";


interface QuestionProps {
  Questions: QuestionsData[];
  refetch: () => void
} 

const ViewQuestions = ({Questions, refetch}: QuestionProps) => {
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
            <QuestionsTable Questions={Questions} refetch={refetch}/>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default ViewQuestions;