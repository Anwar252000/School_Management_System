import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { menuItems } from "@/config/menus";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useFetchUsersQuery, UserData } from "@/services/apis/userService";
import { UserRoleData } from "@/services/apis/userRoleService";

const userPermissionSchema = z.object({
  roleId: z.number().min(1, "Role is required"),
  userId: z.number().min(1, "User is required"),
  entities: z.array(z.string()).min(1, "At least one entity must be selected"),
  canCreate: z.boolean(),
  canRead: z.boolean(),
  canUpdate: z.boolean(),
  canDelete: z.boolean(),
});

type UserPermissionFormValues = z.infer<typeof userPermissionSchema>;

export default function EditUserPermission({
  permissionId,
}: {
  permissionId: number;
}) {
  const [roles, setRoles] = useState<UserRoleData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const [loadingRoles, setLoadingRoles] = useState<boolean>(true);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const { data: users, refetch } = useFetchUsersQuery();
  const allUsers = (users?.data as UserData[]) || [];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserPermissionFormValues>({
    resolver: zodResolver(userPermissionSchema),
    defaultValues: {
      roleId: undefined,
      userId: undefined,
      entities: [],
      // canCreate: false,
      // canRead: false,
      // canUpdate: false,
      // canDelete: false,
    },
  });

  useEffect(() => {
    if (selectedRole) {
      const usersByRole = allUsers.filter(
        (user) => user.roleId === selectedRole
      );
      setFilteredUsers(usersByRole);
    } else {
      setFilteredUsers([]);
    }
  }, [selectedRole, allUsers]);

  const onSubmit: SubmitHandler<UserPermissionFormValues> = (data) => {
    console.log("Updated Permission Data: ", data);
  };

  const handleEntityChange = (title: string) => {
    const updatedEntities = selectedEntities.includes(title)
      ? selectedEntities.filter((entity) => entity !== title)
      : [...selectedEntities, title];

    setSelectedEntities(updatedEntities);
    setValue("entities", updatedEntities, { shouldValidate: true });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Edit User Permission</Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Edit Permission</SheetTitle>
        </SheetHeader>
        <div className="py-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <Select
                  {...register("roleId", { valueAsNumber: true })}
                  onValueChange={(value) => setSelectedRole(Number(value))}
                  disabled={loadingRoles}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem
                        key={role.roleId}
                        value={role.roleId?.toString() ?? ""}
                      >
                        {role.roleName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.roleId && (
                  <p className="text-destructive">{errors.roleId.message}</p>
                )}
              </div>

              <div className="col-span-1">
                <Select
                  {...register("userId", { valueAsNumber: true })}
                  disabled={loadingUsers || !selectedRole}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select User" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredUsers.map((user) => (
                      <SelectItem
                        key={user.userId}
                        value={user.userId?.toString() ?? ""}
                      >
                        {user.userName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.userId && (
                  <p className="text-destructive">{errors.userId.message}</p>
                )}
              </div>

              <div className="col-span-2">
                <Label>Select Entities</Label>
                <div className="grid grid-cols-2 gap-2">
                  {menuItems.map((menu) =>
                    menu.child?.map((entity) => (
                      <div
                        key={entity.title}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={selectedEntities.includes(entity.title)}
                          onChange={() => handleEntityChange(entity.title)}
                        />
                        <Label>{entity.title}</Label>
                      </div>
                    ))
                  )}
                </div>
                {errors.entities && (
                  <p className="text-destructive">{errors.entities.message}</p>
                )}
              </div>

              {/* <div className="col-span-2 grid grid-cols-4 gap-2">
                <div>
                  <Checkbox {...register("canCreate")} />
                  <Label>Can Create</Label>
                </div>
                <div>
                  <Checkbox {...register("canRead")} />
                  <Label>Can Read</Label>
                </div>
                <div>
                  <Checkbox {...register("canUpdate")} />
                  <Label>Can Update</Label>
                </div>
                <div>
                  <Checkbox {...register("canDelete")} />
                  <Label>Can Delete</Label>
                </div>
              </div> */}

              <div className="col-span-2">
                <Button type="submit">Update Permission</Button>
              </div>
            </div>
          </form>
        </div>
        <SheetFooter>
          <SheetClose asChild>Footer Content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
