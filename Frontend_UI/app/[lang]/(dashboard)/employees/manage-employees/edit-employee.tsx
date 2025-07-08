"use client"; // Make sure this is at the very top

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
  EmployeesData,
  useUpdateEmployeeMutation,
} from "@/services/apis/employeeService";
import { RoleData } from "@/services/apis/employeeRoleService";
import {
  CampusData,
  useFetchCampusesQuery,
} from "@/services/apis/campusService";

const employeeSchema = z.object({
  campusId: z.number().int().positive("Campus is required"),
  departmentId: z.number().int().positive("Department is required"),
  roleId: z.number().int().positive("Role is required"),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters long")
    .max(15, "Phone number must be at most 15 characters long"),
  address: z.string().min(1, "Address is required"),
  emergencyContact: z.string().min(1, "Emergency Contact is required"),
  qualifications: z.string().min(1, "Qualifications are required"),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeRoleDataProps {
  employeeData: EmployeesData;
  employeeRole: RoleData[];
  refetch: () => void;
}
const EditEmployee: React.FC<EmployeeRoleDataProps> = ({
  employeeData,
  employeeRole,
  refetch,
}) => {
  const {
    employeeId,
    roleId,
    campusId,
    departmentId,
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    emergencyContact,
    qualifications,
  } = employeeData;

  const [updateEmployee] = useUpdateEmployeeMutation();
  const { data: campusData } = useFetchCampusesQuery();
  const campuses = (campusData?.data as CampusData[]) || [];
  const [selectedCampusId, setSelectedCampusId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      campusId,
      departmentId,
      roleId,
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      emergencyContact,
      qualifications,
    },
  });

  const filteredDepartments =
    campuses.find((campus: CampusData) => campus.campusId === selectedCampusId)
      ?.departments || [];

  const onSubmit: SubmitHandler<EmployeeFormValues> = async (data) => {
    try {
      const updatedEmployee = { ...data, employeeId };
      const response = await updateEmployee(updatedEmployee).unwrap();

      if (response.success) {
        toast.success(
          `${updatedEmployee.firstName} ${updatedEmployee.lastName} was updated successfully!`
        );
        reset();
        refetch();
      } else {
        toast.error("Failed to update the employee");
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
    setValue("departmentId", 0);
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
          <SheetTitle>Edit Employee</SheetTitle>
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
                      {campuses.map((campus: CampusData) => (
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
                  <Select
                    defaultValue={departmentId?.toString() ?? ""}
                    onValueChange={(value) =>
                      setValue("departmentId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredDepartments.length > 0 ? (
                        filteredDepartments.map((department: any) => (
                          <SelectItem
                            className="hover:bg-default-300"
                            key={department.departmentId}
                            value={department.departmentId?.toString() ?? ""}
                          >
                            {department.departmentName}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled value="">
                          No Departments Available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  {errors.departmentId && (
                    <p className="text-destructive">
                      {errors.departmentId.message}
                    </p>
                  )}
                </div>
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
                      {employeeRole?.map((role) => (
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
                <div className="col-span-2 lg:col-span-1">
                  <Input
                    type="text"
                    placeholder="First Name"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-destructive">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Input
                    type="text"
                    placeholder="Last Name"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-destructive">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Input
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Input
                    type="text"
                    placeholder="Phone Number"
                    {...register("phoneNumber")}
                  />
                  {errors.phoneNumber && (
                    <p className="text-destructive">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="Address"
                    {...register("address")}
                  />
                  {errors.address && (
                    <p className="text-destructive">{errors.address.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="Emergency Contact"
                    {...register("emergencyContact")}
                  />
                  {errors.emergencyContact && (
                    <p className="text-destructive">
                      {errors.emergencyContact.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="Qualifications"
                    {...register("qualifications")}
                  />
                  {errors.qualifications && (
                    <p className="text-destructive">
                      {errors.qualifications.message}
                    </p>
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

export default EditEmployee;
