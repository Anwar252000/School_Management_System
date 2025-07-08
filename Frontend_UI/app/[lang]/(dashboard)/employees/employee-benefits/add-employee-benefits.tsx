"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
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
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";
import {
  EmployeeBenefitData,
  useAddEmployeeBenefitsMutation,
} from "@/services/apis/employeeBenefitsService";
import { EmployeesData } from "@/services/apis/employeeService";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface AddEmployeeBenefitProps {
  employees: EmployeesData[];
  refetch: () => void;
}

const AddEmployeeBenefit: React.FC<AddEmployeeBenefitProps> = ({
  employees,
  refetch,
}) => {
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeBenefitData>();

  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const [addBenefit] = useAddEmployeeBenefitsMutation();

  const onSubmit: SubmitHandler<EmployeeBenefitData> = async (data) => {
    try {
      const payload: EmployeeBenefitData = {
        ...data,
        employeeId: Number(employeeId),
        createdBy: loggedUser?.userId,
      };

      const response = await addBenefit(payload);

      if (response.data?.success) {
        toast.success("Benefit added successfully!");
        reset();
        refetch();
      } else {
        toast.error(response.data?.message || "Error while adding benefit");
      }
    } catch (error) {
      console.error("Benefit submission error:", error);
      toast.error("Failed to submit benefit");
    }
  };

  const handleError = () => {
    toast.error("Please correct the errors in the form.");
  };

  return (
    <Sheet>
      <div className="flex justify-end mb-4">
        <SheetTrigger asChild>
          <Button>
            <Icon icon="mdi:plus-box" className="w-6 h-6 mr-2" />
            Add Benefit
          </Button>
        </SheetTrigger>
      </div>

      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add Employee Benefit</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col justify-between" style={{ height: "calc(100vh - 80px)" }}>
          <div className="py-5 overflow-y-auto pr-2">
            <form onSubmit={handleSubmit(onSubmit, handleError)}>
              <div className="grid grid-cols-2 gap-4">
                {/* Employee Dropdown */}
                <div className="col-span-2">
                  <Label>Select Employee</Label>
                  <SearchableSelect
                    options={employees?.map((e) => ({
                      label: `${e?.firstName} ${e?.lastName}`,
                      value: e?.employeeId?.toString() || "",
                    }))}
                    onValueChange={(value) => setEmployeeId(parseInt(value) || null)}
                  />
                </div>

                {/* Benefit Type */}
                <div className="col-span-2">
                  <Label>Benefit Type</Label>
                  <Input
                    type="text"
                    placeholder="Benefit Type"
                    {...register("benefitType", {
                      required: "Benefit type is required",
                    })}
                  />
                  {errors.benefitType && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.benefitType.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Benefit Description"
                    {...register("description", {
                      required: "Description is required",
                    })}
                  />
                  {errors.description && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="col-span-2">
                  <Button type="submit">Submit Benefit</Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <div className="text-sm text-muted-foreground">You can close this panel from here.</div>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AddEmployeeBenefit;
