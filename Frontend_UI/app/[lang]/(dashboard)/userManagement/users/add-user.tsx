"use client";
import React, { useState } from "react";
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
import { useAddUserMutation, UserData } from "@/services/apis/userService";
import { UserRoleData } from "@/services/apis/userRoleService";
import { CampusData } from "@/services/apis/campusService";

// Props interface
interface UserListTableProps {
  users: UserData[];
  campuses: CampusData[];
  userRole: UserRoleData[];
  refetch: () => void;
}

// Validation schema using zod
const userSchema = z.object({
  roleId: z.number().int().positive("Role is required"),
  campusId: z.number().int().positive("Campus is required"),
  userName: z.string().min(1, "User Name is required"),
  passwordHash: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .refine((val) => /\d/.test(val), {
      message: "Password must contain at least one numeric character",
    }),
  createdAt: z.preprocess(() => new Date(), z.date()),
});

type UserFormValues = z.infer<typeof userSchema>;

const AddUser: React.FC<UserListTableProps> = ({
  campuses,
  userRole,
  refetch,
}) => {
  const [selectedCampusId, setSelectedCampusId] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [addUser] = useAddUserMutation();

  const {
    register: formRegister,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit: SubmitHandler<UserFormValues> = async (data) => {
    try {
      const response = await addUser(data);
      if (response?.data?.success) {
        toast.success(`User ${data.userName} added successfully!`);
        reset();
        refetch();
      } else {
        toast.error(
          `Error: ${response?.data?.message || "Something went wrong"}`
        );
      }
    } catch (error) {
      toast.error("Failed to register user.");
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          Add User
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add New User</SheetTitle>
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
                  <Select onValueChange={handleCampusChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Campus" />
                    </SelectTrigger>
                    <SelectContent>
                      {campuses.map((campus) => (
                        <SelectItem
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
                  <Select
                    onValueChange={(value) =>
                      setValue("roleId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {userRole.map((role) => (
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

                <div className="col-span-2 lg:col-span-1">
                  <Input
                    type="text"
                    placeholder="User Name"
                    {...formRegister("userName")}
                  />
                  {errors.userName && (
                    <p className="text-destructive">
                      {errors.userName.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...formRegister("passwordHash")}
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                    >
                      {showPassword ? (
                        <Icon icon="mdi:eye-off" className="w-5 h-5" />
                      ) : (
                        <Icon icon="mdi:eye" className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.passwordHash && (
                    <p className="text-destructive">
                      {errors.passwordHash.message}
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
};

export default AddUser;
