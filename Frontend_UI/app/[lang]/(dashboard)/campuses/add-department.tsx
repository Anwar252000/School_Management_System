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
import { CampusData } from "@/services/apis/campusService";
import { useAddDepartmentsMutation } from "@/services/apis/departmentService";

// Define Zod schema
const departmentSchema = z.object({
  campusId: z.coerce.number().optional(),
  departmentName: z.string().min(1, "Department Name is required"),
  description: z.string().min(1),
  // isActive: z.boolean() // Add this line
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;
interface DepartmentSheetProps {
  campuses: CampusData[];
  refetch: () => void;
}
export default function AddDepartment({ campuses, refetch }: DepartmentSheetProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
  });

  const [addDepartment] = useAddDepartmentsMutation();
  // const [campusId, setCampusId] = useState(campuses);

  const onSubmit: SubmitHandler<DepartmentFormValues> = async (data) => {
    try {
      const response = await addDepartment(data);
      if (response.data?.success) {
        const departmentName = Array.isArray(response.data?.data)
          ? response.data?.data[0].departmentName
          : response.data?.data.departmentName;
          toast.success(`${departmentName} Department Added successfully!`);
          refetch();
          reset();
        }else {
          console.error("Error:", response);
          toast.error(`Error: ${response.data?.message || "Something went wrong"}`);
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
        <Button aria-hidden="true">
          <span className="text-xl mr-1">
            <Icon
              icon="heroicons:building-library-solid"
              className="w-6 h-6 mr-2"
            />
          </span>
          Add Department
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add New Department</SheetTitle>
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
                    onValueChange={(value) =>
                      setValue("campusId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a campus" />
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
