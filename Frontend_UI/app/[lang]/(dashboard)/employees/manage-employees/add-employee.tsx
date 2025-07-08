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
} from "@/components/ui/sheet"; // Adjusted service import
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EmployeesData,
  useAddEmployeeMutation,
} from "@/services/apis/employeeService";
import { CampusData } from "@/services/apis/campusService";
import { RoleData } from "@/services/apis/employeeRoleService";
import useAuth from "@/hooks/use-auth";

interface EmployeeListTableProps {
  campuses: CampusData[];
  employeeRole: RoleData[];
  refetch: () => void;
}
// Define Zod schema
const employeeSchema = z.object({
  roleId: z.number().int().positive("Role is required"),
  campusId: z.number().int().positive("Campus is required"),
  departmentId: z.number().int().positive("Department is required"),
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

const AddEmployee: React.FC<EmployeeListTableProps> = ({
  campuses,
  employeeRole,
  refetch,
}) => {
  const [addEmployee] = useAddEmployeeMutation();
  const [selectedCampusId, setSelectedCampusId] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
  });

  const {userId} = useAuth();

  const onSubmit: SubmitHandler<EmployeeFormValues> = async (data) => {
    try {
      const payload = {
        ...data,
        createdBy: userId || 0,
      }
      const response = await addEmployee(data as EmployeesData).unwrap();
      if (response.success) {
        toast.success(
          `Employee ${data.firstName} ${data.lastName} added successfully!`
        );
        reset();
        refetch();
      } else {
        console.error("Error:", response);
        toast.error(`Error: ${response.message || "Something went wrong"}`);
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

  const handleCampusChange = (value: string) => {
    const campusId = parseInt(value);
    setSelectedCampusId(campusId);
    setValue("campusId", campusId);
    // Reset departmentId when campus changes
    setValue("departmentId", 0);
  };

  const filteredDepartments =
    campuses?.find((campus) => campus.campusId === selectedCampusId)
      ?.departments || [];

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
          Add Employee
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add New Employee</SheetTitle>
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
                  <Select
                    onValueChange={(value) =>
                      setValue("departmentId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredDepartments?.length > 0 ? (
                        filteredDepartments?.map((department) => (
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
                <div className="col-span-2 lg:col-span-1">
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
                <div className="col-span-2 lg:col-span-1">
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
export default AddEmployee;
