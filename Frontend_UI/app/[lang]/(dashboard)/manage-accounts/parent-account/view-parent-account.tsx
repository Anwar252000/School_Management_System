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
import { ParentAccountData } from "@/services/apis/parentAccountService";
import ParentAccountListTable from "./parent-account-table";

// This component allows you to view class details in a sheet.
export default function ViewParentAccount({
  selectedParentAccount,
}: {
  selectedParentAccount: ParentAccountData[] | null;
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
          <SheetTitle>Parent Accounts</SheetTitle>
        </SheetHeader>
        <div>
          <div className="py-6">
            <ParentAccountListTable
              parentAccounts={selectedParentAccount as ParentAccountData[]}
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
