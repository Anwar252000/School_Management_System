"use client"; // Make sure this is at the very top

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  RoleData,
  useUpdateRoleMutation,
} from "@/services/apis/employeeRoleService";

// Define Zod schema for class form validation
const roleSchema = z.object({
  roleName: z.string().min(1, "Role Name is required"),
  roleDescription: z.string().optional(),
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleDataProps {
  refetch: () => void;
  rolesData: RoleData;
}

const EditRole: React.FC<RoleDataProps> = ({ rolesData, refetch }) => {
  const { roleId, roleName, roleDescription } = rolesData;
  const [updateRole] = useUpdateRoleMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      roleName,
      roleDescription,
    },
  });

  const onSubmit: SubmitHandler<RoleFormValues> = async (data) => {
    try {
      const updatedRole = { ...data, roleId };
      const response = await updateRole(updatedRole).unwrap();

      if (response.success) {
        toast.success(`${updatedRole.roleName} updated successfully!`);
        reset();
        refetch();
      } else {
        toast.error("Failed to update the Role");
      }
    } catch (error) {
      console.error("Request failed:", error);
      toast.error("Request failed");
    }
  };

  const handleError = () => {
    if (Object.keys(errors).length > 0) {
      toast.error("Please correct the errors in the form.");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="h-7 w-7">
          <Icon icon="heroicons:pencil" className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Edit Role</SheetTitle>
        </SheetHeader>
        <div
          className="flex flex-col justify-between"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="py-5">
            <hr />
            <form onSubmit={handleSubmit(onSubmit, handleError)}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="Role Name"
                    {...register("roleName")}
                  />
                  {errors.roleName && (
                    <p className="text-destructive">
                      {errors.roleName.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="Role Description"
                    {...register("roleDescription")}
                  />
                  {errors.roleDescription && (
                    <p className="text-destructive">
                      {errors.roleDescription?.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Button type="submit">Update</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="ghost">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EditRole;
