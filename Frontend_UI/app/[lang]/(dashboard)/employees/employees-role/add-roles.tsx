"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  useAddRoleMutation,
} from "@/services/apis/employeeRoleService";
import useAuth from "@/hooks/use-auth";
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";

// Define Zod schema
const roleSchema = z.object({
  roleName: z.string().min(1, "Role Name is required"),
  roleDescription: z.string().optional(),
});

type RoleFormValues = z.infer<typeof roleSchema>;

export default function AddRole({ refetch }: { refetch: () => void }) {
  const [addRole] = useAddRoleMutation();
  const loggedUser = useSelector((state: RootState) => state.auth.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
  });

  const onSubmit: SubmitHandler<RoleFormValues> = async (data) => {
    try {
      const payload = {
        ...data,
        createdBy: loggedUser?.userId,
      };
      const response = await addRole(payload as RoleData);

      if (response.data?.success) {
        toast.success(`${response.data?.data.roleName} Added successfully!`);
        reset();
        refetch();
      } else {
        console.error("Error:", response);
        toast.error(
          `Error: ${response.data?.message || "Something went wrong"}`
        );
      }
    } catch (error) {
      console.error("Request Failed:", error);
      toast.error("Request Failed");
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
        <Button>
          <span className="text-xl mr-1">
            <Icon
              icon="heroicons:building-library-solid"
              className="w-6 h-6 mr-2"
            />
          </span>
          Add Role
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add New Role</SheetTitle>
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
                  <Textarea
                    placeholder="Role Description"
                    {...register("roleDescription")}
                  />
                  {errors.roleDescription && (
                    <p className="text-destructive">
                      {errors.roleDescription.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Button type="submit">Submit Form</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
