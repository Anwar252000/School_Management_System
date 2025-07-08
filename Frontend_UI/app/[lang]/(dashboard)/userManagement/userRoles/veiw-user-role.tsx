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
import { Icon } from "@iconify/react";
import UserRoleTable from "./user-role-table";
import AddUserRole from "./add-user-role";
import { UserRoleData } from "@/services/apis/userRoleService";

interface UserRoleProps {
  userRole: UserRoleData[];
  refetch: () => void;
}
// This component allows you to view role details in a sheet.
const ViewUserRole: React.FC<UserRoleProps> = ({ userRole, refetch }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <span className="text-xl mr-1">
            <Icon
              icon="heroicons:building-library-solid"
              className="w-6 h-6 mr-2"
            />
          </span>
          Add/View User Role
        </Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>User Role</SheetTitle>
          {/* <div className="relative"> */}
          <SheetDescription className="absolute top-0 right-4  p-4">
            <AddUserRole refetch={refetch} />
          </SheetDescription>
          {/* </div> */}
        </SheetHeader>
        <div>
          <div className="py-6">
            <UserRoleTable userRole={userRole} refetch={refetch} />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ViewUserRole;
