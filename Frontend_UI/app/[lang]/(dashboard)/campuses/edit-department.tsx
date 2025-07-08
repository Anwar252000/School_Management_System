"use client";
import React, { useState, useEffect } from "react";
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
import { DepartmentData, useUpdateDepartmentMutation } from "@/services/apis/departmentService";
import { CampusData } from "@/services/apis/campusService";

// Define Zod schema
const departmentSchema = z.object({
  campusId: z.coerce.number().optional(),
  campusName: z.string().optional(),
  departmentName: z.string().min(1, "Department Name is required"),
  description: z.string().min(1),
  // isActive: z.boolean() // Add this line
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

export default function EditDepartment({
  department,
  campus,
  refetch,
}: {
  department: DepartmentData;
  campus: CampusData;
  refetch: () => void;
}) {
  console.log(department);
  const { departmentId, departmentName, description } = department;
  const { campusId, campusName } = campus;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      campusId,
      campusName,
      departmentName,
      description,
    },
  });

  const [updateDepartment] = useUpdateDepartmentMutation();
  //const [campusId, setCampusId] = useState(campuses);

  const onSubmit: SubmitHandler<DepartmentFormValues> = async (data) => {
    try {
      const updatedData = { ...data, departmentId };
      const response = await updateDepartment(updatedData);
      if (response.data?.success) {
        if (response.data?.success) {
        toast.success(`${updatedData.departmentName} Department Updated successfully!`);
        refetch();  
        reset();
      } else {
        toast.error("Failed to update the campus");
      }
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
        {/* <Button aria-hidden="true">
          <span className="text-xl mr-1">
            <Icon
              icon="heroicons:building-library-solid"
              className="w-6 h-6 mr-2"
            />
          </span>
          Add Department
        </Button> */}
        <Button
          aria-hidden="true"
          size="icon"
          variant="outline"
          color="secondary"
          className="h-7 w-7"
        >
          <Icon icon="heroicons:pencil" className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Edit Department</SheetTitle>
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
                    onValueChange={(value) =>
                      setValue("campusId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a campus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        className="hover:bg-default-300"
                        key={campusId}
                        value={campusId?.toString() ?? ""}
                      >
                        {campusName}
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {errors.campusId && (
                    <p className="text-destructive">
                      {errors.campusId.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="Department Name"
                    {...register("departmentName")}
                  />
                  {errors.departmentName && (
                    <p className="text-destructive">
                      {errors.departmentName.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="Description"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-destructive">
                      {errors.description.message}
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
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
