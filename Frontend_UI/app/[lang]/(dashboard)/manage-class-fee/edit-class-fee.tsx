"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useUpdateClassFeeMutation } from "@/services/apis/manageClassFeeService";
import { FeeCategoryData } from "@/services/apis/feeCategoryService";

const classFeeSchema = z.object({
  classId: z.number().optional(),
  feeCategoryId: z.number().optional(),
  campusId: z.number().optional(),
  amount: z.number().min(1, "Amount is required"),
  // createdBy: z.number().optional(),
  // updatedBy: z.number().optional(),
});

type ClassFeeFormValues = z.infer<typeof classFeeSchema>;

interface EditClassFeeProps {
  classFeeData: {
    classFeeId?: number;
    classId?: number;
    feeCategoryId?: number;
    campusId?: number;
    amount?: number;
    createdBy?: number;
  };
  classes?: ClassData[];
  campuses: CampusData[];
  feeCategory?: FeeCategoryData[];
  refetch: () => void;
}

export default function EditClassFee({
  classFeeData,
  refetch,
  classes,
  campuses,
  feeCategory,
}: EditClassFeeProps) {
  const { classFeeId, classId, feeCategoryId, campusId, amount } = classFeeData;
  const [updateClassFee] = useUpdateClassFeeMutation();
  // const loggedUser = useSelector((state: RootState) => state.auth.user);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ClassFeeFormValues>({
    resolver: zodResolver(classFeeSchema),
    defaultValues: { classId, feeCategoryId, campusId, amount },
  });

  const onSubmit: SubmitHandler<ClassFeeFormValues> = async (data) => {
    try {
      const payload = { ...data, classFeeId };
      const response = await updateClassFee(payload);
      console.log("Response:", response);
      if (response?.data?.success) {
        toast.success("Class Fee updated successfully!");
        refetch();
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
        <Button size="icon" variant="outline" className="h-7 w-7">
          <Icon icon="heroicons:pencil" className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Edit Class Fee</SheetTitle>
        </SheetHeader>
        <div className="py-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="mb-1 text-gray-700">Select Campus</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("campusId", parseInt(value))
                  }
                  defaultValue={campusId?.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a campus" />
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

              <div className="col-span-1">
                <Label>Select Class</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("classId", parseInt(value))
                  }
                  defaultValue={classId?.toString()}
                >
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
              <div className="col-span-1">
                <Label>Select Fee Category</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("feeCategoryId", parseInt(value))
                  }
                  defaultValue={feeCategoryId?.toString()}
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
              <div className="col-span-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="Amount"
                  {...register("amount", { valueAsNumber: true })}
                />
                {errors.amount && (
                  <p className="text-destructive">{errors.amount.message}</p>
                )}
              </div>

              <div className="col-span-2">
                <Button type="submit">Update Class Fee</Button>
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
}
