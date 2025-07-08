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
import AccountGroupListTable from "./account-group-table";
import { AccountGroupData } from "@/services/apis/accountGroupService";

// This component allows you to view class details in a sheet.
export default function ViewAccountGroups({
  selectedAccountGroup,
}: {
  selectedAccountGroup: AccountGroupData[] | null;
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
          <SheetTitle>Account Groups</SheetTitle>
        </SheetHeader>
        <div>
          <div className="py-6">
            <AccountGroupListTable
              accountGroups={selectedAccountGroup as AccountGroupData[]}
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
