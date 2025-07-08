"use client"; // Required for React hooks in Next.js

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { ClassData } from "@/services/apis/classService";
import { CampusData } from "@/services/apis/campusService";
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";
import { useAddClassFeeMutation } from "@/services/apis/manageClassFeeService";
import { FeeCategoryData } from "@/services/apis/feeCategoryService";

// ✅ Define form data type without schema
interface ClassFeeFormValues {
  amount?: number;
}

interface ClassFeeProps {
  classes: ClassData[];
  campuses: CampusData[];
  feeCategory: FeeCategoryData[];
  refetch: () => void;
}

export default function AddClassFee({
  refetch,
  classes,
  campuses,
  feeCategory,
}: ClassFeeProps) {
  const [classId, setClassId] = useState<number | null>(0);
  const [campusId, setCampusId] = useState<number | null>(0);
  const [feeCategoryId, setFeeCategoryId] = useState<number | null>(0);
  const [addClassFee] = useAddClassFeeMutation();
  const loggedUser = useSelector((state: RootState) => state.auth.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClassFeeFormValues>();

  const onSubmit: SubmitHandler<ClassFeeFormValues> = async (data) => {
    try {
      const payload = {
        ...data,
        classId: classId ?? 0,
        campusId: campusId ?? 0,
        feeCategoryId: feeCategoryId ?? 0,
        createdBy: loggedUser?.userId || 0,
      };
      console.log(payload, "payload");
      const response = await addClassFee(payload);

      if (response?.data?.success) {
        toast.success("Class Fee Added successfully!");
        refetch();
        reset();
      } else {
        console.error("Error:", response);
        toast.error(response?.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Request Failed:", error);
      toast.error("Request Failed");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Icon icon="heroicons:cash-solid" className="w-6 h-6 mr-2" />
          Add Class Fee
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add New Class Fee</SheetTitle>
        </SheetHeader>
        <div className="py-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Three dropdowns in one row */}
            <div className="grid grid-cols-3 gap-4">
              {/* Select Campus */}
              <div>
                <Label className="mb-1 text-gray-700">Select Campus</Label>
                <Select onValueChange={(value) => setCampusId(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Campus" />
                  </SelectTrigger>
                  <SelectContent>
                    {campuses?.map((campus) => (
                      <SelectItem
                        key={campus.campusId}
                        value={campus.campusId?.toString() ?? ""}
                      >
                        {campus.campusName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Select Class */}
              <div>
                <Label className="mb-1 text-gray-700">Select Class</Label>
                <Select onValueChange={(value) => setClassId(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes?.map((cd) => (
                      <SelectItem
                        key={cd.classId}
                        value={cd.classId?.toString() || ""}
                      >
                        {cd.className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Select Fee Category */}

              <div>
                <Label className="mb-1 text-gray-700">
                  Select Fee Category
                </Label>
                <Select
                  onValueChange={(value) => setFeeCategoryId(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Fee Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {feeCategory?.map((cd) => (
                      <SelectItem
                        key={cd.feeCategoryId}
                        value={cd.feeCategoryId?.toString() || ""}
                      >
                        {cd.feeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Amount Input */}
            <div className="mt-4">
              <Label className="mb-1 text-gray-700">Amount</Label>
              <Input
                type="number"
                placeholder="Amount"
                {...register("amount", { valueAsNumber: true })}
              />
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <Button type="submit" className="w-full">
                Submit Form
              </Button>
            </div>
          </form>
        </div>
        <SheetFooter>
          <SheetClose asChild>Footer Content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
