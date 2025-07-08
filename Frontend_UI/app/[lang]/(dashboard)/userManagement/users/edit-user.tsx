"use client";

import React, { useEffect, useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CampusData,
  useFetchCampusesQuery,
} from "@/services/apis/campusService";
import { UserData, useUpdateUserMutation } from "@/services/apis/userService";
import { UserRoleData } from "@/services/apis/userRoleService";

const userSchema = z.object({
  campusId: z.number().int().positive("Campus is required"),
  roleId: z.number().int().positive("Role is required"),
  userName: z.string().min(1, "User Name is required"),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserProps {
  userData: UserData;
  userRole: UserRoleData[];
  refetch: () => void;
}

const EditUser: React.FC<UserProps> = ({ userData, refetch, userRole }) => {
  const { userId, roleId, campusId, userName } = userData;

  const [selectedCampusId, setSelectedCampusId] = useState<number | null>(null);
  const { data: campusData } = useFetchCampusesQuery();
  const campuses = (campusData?.data as CampusData[]) || [];
  const [updateUser] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      campusId,
      roleId,
      userName,
    },
  });

  const onSubmit: SubmitHandler<UserFormValues> = async (data) => {
    try {
      const updatedUser = { ...data, userId };
      const response = await updateUser(updatedUser);

      if (response?.data?.success) {
        toast.success(`${updatedUser.userName} was updated successfully!`);
        reset();
        refetch();
      } else {
        toast.error("Failed to update the User");
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

  const handleCampusChange = (value: string) => {
    const campusId = parseInt(value);
    setSelectedCampusId(campusId);
    setValue("campusId", campusId);
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
          <SheetTitle>Edit User</SheetTitle>
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
                  <Select
                    defaultValue={campusId?.toString() ?? ""}
                    onValueChange={handleCampusChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Campus" />
                    </SelectTrigger>
                    <SelectContent>
                      {campuses?.map((campus) => (
                        <SelectItem
                          className="hover:bg-default-300"
                          key={campus.campusId}
                          value={campus.campusId?.toString() ?? ""}
                        >
                          {campus.campusName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {errors.campusId && (
                    <p className="text-destructive">
                      {errors.campusId.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Input
                    type="text"
                    placeholder="User Name"
                    {...register("userName")}
                  />
                  {errors.userName && (
                    <p className="text-destructive">
                      {errors.userName.message}
                    </p>
                  )}
                </div>
                {/* <div className="col-span-2 lg:col-span-1">
                  <Input
                    type="text"
                    placeholder="Password"
                    {...register("passwordHash")}
                  />
                  
                </div> */}

                <div className="col-span-2 lg:col-span-1">
                  <Select
                    defaultValue={roleId?.toString() ?? ""}
                    onValueChange={(value) =>
                      setValue("roleId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {userRole?.map((role) => (
                        <SelectItem
                          className="hover:bg-default-300"
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
              </div>
              <SheetFooter className="py-5">
                <SheetClose asChild>
                  <Button type="submit" className="w-full sm:w-auto">
                    Save Changes
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                </SheetClose>
              </SheetFooter>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditUser;
