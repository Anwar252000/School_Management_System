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

import UserPermissionListTable from "./user-permission-table";
import AddUserPermission from "./add-user-permission-form";
import {
  useFetchUserPermissionsQuery,
  UserPermissionData,
} from "@/services/apis/userPermissionService";

export default function ViewUserPermission() {
  const { data: userPermissions, refetch } = useFetchUserPermissionsQuery();
  const permissions = (userPermissions?.data as UserPermissionData[]) || [];

  const handleRefetch = () => {
    refetch();
  };

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
          Add/View User Permission
        </Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>User Permission</SheetTitle>
          {/* <div className="relative"> */}
          <SheetDescription className="absolute top-0 right-4  p-4">
            <AddUserPermission refetch={handleRefetch} />
          </SheetDescription>
          {/* </div> */}
        </SheetHeader>
        <div>
          <div className="py-6">
            <UserPermissionListTable
              permissions={permissions}
              refetch={handleRefetch}
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
