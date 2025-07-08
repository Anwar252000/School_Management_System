"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  EmployeeAppraisalData,
  useUpdateEmployeeAppraisalMutation,
} from "@/services/apis/employeePerformanceService";

interface EditEmployeePerformanceProps {
  performance: EmployeeAppraisalData;
  refetch: () => void;
}

const EditEmployeePerformance: React.FC<EditEmployeePerformanceProps> = ({
  performance,
  refetch,
}) => {
  const [updatePerformance] = useUpdateEmployeeAppraisalMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeAppraisalData>({
    defaultValues: {
      appraisalId:performance.appraisalId,
      employeeId: performance.employeeId,
      employeeName: performance.employeeName, // Add employee name
      appraisalDate: performance.appraisalDate,
      performanceScore: performance.performanceScore,
      comments: performance.comments,
    },
  });

  const onSubmit: SubmitHandler<EmployeeAppraisalData> = async (formData) => {
    try {
      const response = await updatePerformance(formData).unwrap();
      if (response.success) {
        toast.success("Performance updated successfully!");
        reset();
        refetch();
      } else {
        toast.error("Failed to update performance.");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Something went wrong!");
    }
  };

  const handleError = () => {
    toast.error("Please fix the form errors.");
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
          <SheetTitle>Edit Performance</SheetTitle>
        </SheetHeader>
        <div className="py-5">
          <form onSubmit={handleSubmit(onSubmit, handleError)}>
            <div className="grid grid-cols-2 gap-4">
              {/* Employee Name */}
              <div className="col-span-2">
                <Label>Employee Name</Label>
                <Input
                  type="text"
                  {...register("employeeName", { required: "Employee name is required" })}
                  placeholder="Employee Name"
                  disabled // Optionally disable the input field if the name should not be editable
                />
                {errors.employeeName && <p className="text-destructive">{errors.employeeName.message}</p>}
              </div>

              {/* Appraisal Date */}
              <div className="col-span-2">
                <Label>Appraisal Date</Label>
                <Input
                  type="date"
                  {...register("appraisalDate", { required: "Appraisal date is required" })}
                />
                {errors.appraisalDate && <p className="text-destructive">{errors.appraisalDate.message}</p>}
              </div>

              {/* Performance Score */}
              <div className="col-span-2">
                <Label>Performance Score</Label>
                <Input
                  type="number"
                  {...register("performanceScore", { required: "Performance score is required" })}
                />
                {errors.performanceScore && <p className="text-destructive">{errors.performanceScore.message}</p>}
              </div>

              {/* Comments */}
              <div className="col-span-2">
                <Label>Comments</Label>
                <Textarea
                  {...register("comments", { required: "Comments are required" })}
                />
                {errors.comments && <p className="text-destructive">{errors.comments.message}</p>}
              </div>

              <div className="col-span-2">
                <Button type="submit">Update</Button>
              </div>
            </div>
          </form>
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

export default EditEmployeePerformance;
