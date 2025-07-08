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
import {
  EmployeeBenefitData,
  useUpdateEmployeeBenefitsMutation,
} from "@/services/apis/employeeBenefitsService";
import { Label } from "@/components/ui/label";
import { EmployeesData } from "@/services/apis/employeeService";
import { SearchableSelect } from "@/components/ui/searchable-select";


interface EditEmployeeBenefitProps {
  employees: EmployeesData[];
  benefitData: EmployeeBenefitData;
  refetch: () => void;
}

const EditEmployeeBenefit: React.FC<EditEmployeeBenefitProps> = ({
  benefitData,
  employees,
  refetch,
}) => {
  const [employeeId, setEmployeeId] = useState<number | null>(benefitData.employeeId || null);
  const [updateBenefit] = useUpdateEmployeeBenefitsMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeBenefitData>({
    defaultValues: {
      benefitId: benefitData.benefitId,
      employeeId: benefitData.employeeId,
      benefitType: benefitData.benefitType,
      description: benefitData.description,
      createdBy: benefitData.createdBy,
    },
  });

  const onSubmit: SubmitHandler<EmployeeBenefitData> = async (formData) => {
    try {
      const payload = {
        ...formData,
        benefitId: benefitData.benefitId,
        employeeId: employeeId ?? formData.employeeId,
      };

      const response = await updateBenefit(payload).unwrap();

      if (response.success) {
        toast.success("Benefit updated successfully!");
        reset();
        refetch();
      } else {
        toast.error("Failed to update benefit.");
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
          <SheetTitle>Edit Benefit</SheetTitle>
        </SheetHeader>
        <div className="py-5">
          <form onSubmit={handleSubmit(onSubmit, handleError)}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Select Employee</Label>
                <SearchableSelect
                  options={employees?.map((e) => ({
                    label: `${e?.firstName} ${e?.lastName}`,
                    value: e?.employeeId?.toString() || "",
                  }))}
                  value={employeeId?.toString() || ""}
                  onValueChange={(value) => setEmployeeId(parseInt(value) || null)}
                />
              </div>

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

              <div className="col-span-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Description"
                  {...register("description")}
                />
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

export default EditEmployeeBenefit;
