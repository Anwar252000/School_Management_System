"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { EmployeesData } from "@/services/apis/employeeService";
import { useAddEmployeeAppraisalMutation } from "@/services/apis/employeePerformanceService";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";

// Define form types manually
type AppraisalFormValues = {
  employeeId: string;
  appraisalDate: string;
  performanceScore: string;
  comments: string;
};

interface Props {
  employees: EmployeesData[];
  refetch: () => void;
}

const AddEmployeeAppraisal: React.FC<Props> = ({ employees, refetch }) => {
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [addAppraisal] = useAddEmployeeAppraisalMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppraisalFormValues>();

  const loggedUser = useSelector((state: RootState) => state.auth.user);


  const onSubmit: SubmitHandler<AppraisalFormValues> = async (data) => {
    const preparedData = {
      ...data,
      employeeId: Number(employeeId),
      performanceScore: parseInt(data.performanceScore),
      createby: loggedUser?.userId,
    };

    try {
      const response = await addAppraisal(preparedData).unwrap();
      if (response.success) {
        toast.success("Appraisal added successfully!");
        reset();
        refetch();
      } else {
        toast.error(response.message || "Failed to add appraisal");
      }
    } catch (err) {
      console.error(err);
      toast.error("Request failed");
    }
  };

  const handleError = () => {
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the form errors");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Icon icon="heroicons:document-plus-solid" className="w-5 h-5 mr-2" />
          Add Appraisal
        </Button>
      </SheetTrigger>

      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add Performance Appraisal</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col justify-between" style={{ height: "calc(100vh - 80px)" }}>
          <div className="py-5 overflow-y-auto pr-2">
            <form onSubmit={handleSubmit(onSubmit, handleError)} className="grid grid-cols-2 gap-4">
              {/* Employee Dropdown with Search */}
              <div>
                <Label>Select Employee</Label>
                <SearchableSelect
                  options={employees?.map((e) => ({
                    label: `${e?.firstName} ${e?.lastName}`,
                    value: e?.employeeId?.toString() || "",
                  }))}
                  onValueChange={(value) => setEmployeeId(parseInt(value) || null)}
                />
                {errors.employeeId && <p className="text-destructive">{errors.employeeId.message}</p>}
              </div>

              {/* Appraisal Date */}
              <div>
                <Label>Appraisal Date</Label>
                <Input
                  type="date"
                  {...register("appraisalDate", {
                    required: "Appraisal date is required",
                  })}
                />
                {errors.appraisalDate && <p className="text-destructive">{errors.appraisalDate.message}</p>}
              </div>

              {/* Performance Score */}
              <div>
                <Label>Performance Score</Label>
                <Input
                  type="number"
                  {...register("performanceScore", {
                    required: "Performance score is required",
                  })}
                />
                {errors.performanceScore && <p className="text-destructive">{errors.performanceScore.message}</p>}
              </div>

              {/* Comments */}
              <div className="col-span-2">
                <Label>Comments</Label>
                <Input
                  type="text"
                  {...register("comments", {
                    required: "Comments are required",
                  })}
                />
                {errors.comments && <p className="text-destructive">{errors.comments.message}</p>}
              </div>

              {/* Submit Button */}
              <div className="col-span-2">
                <Button type="submit" className="w-full">Submit Appraisal</Button>
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

export default AddEmployeeAppraisal;
