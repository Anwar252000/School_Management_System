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
import { useState } from "react";
import RoleListTable from "./role-table";
import { Icon } from "@iconify/react";
import AddRole from "./add-roles";
import { RoleData } from "@/services/apis/employeeRoleService";

interface EmployeeRoleProps {
  roles: RoleData[];
  refetch: () => void;
}

const ViewRole: React.FC<EmployeeRoleProps> = ({ roles, refetch }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleRefetch = () => {
    refetch();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <span className="text-xl mr-1">
            <Icon icon="heroicons:building-library-solid" className="w-6 h-6 mr-2" />
          </span>
          Add/View Role
        </Button>
      </SheetTrigger>

      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Role</SheetTitle>
          <SheetDescription className="absolute top-0 right-4 p-4">
            <AddRole refetch={handleRefetch} />
          </SheetDescription>
        </SheetHeader>

        <div>
          <div className="py-6">
            <RoleListTable roles={roles} refetch={handleRefetch} />
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ViewRole;
