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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PeriodData, useUpdatePeriodMutation } from "@/services/apis/periodService";

// Define Zod schema for class form validation
const periodSchema = z.object({
  periodId: z.coerce.number().optional(),
  startTime: z.string().min(1,"Invalid start time format"),
  endTime: z.string().min(1,"Invalid start time format"),
  periodName: z.string(),
  isActive: z.boolean().optional()
});

type PeriodFormValues = z.infer<typeof periodSchema>;

interface PeriodsProps {
  periodItem: PeriodData[];
  periodData: PeriodData[]; 
  refetch: () => void
}

export default function EditPeriods({ periodItem, periodData, refetch }: PeriodsProps ) {
  const [updatePeriod] = useUpdatePeriodMutation();

  const { periodId, periodName, startTime, endTime, isActive } = periodItem[0];

  const { setValue, handleSubmit, reset, formState: { errors } } = useForm<PeriodFormValues>({
    resolver: zodResolver(periodSchema),
    defaultValues: {
      periodName,
      startTime,
      endTime,
    },
  });

  const onSubmit: SubmitHandler<PeriodFormValues> = async (data) => {
     
    try {
      const updatedPeriod = { ...data, periodId };
      const response = await updatePeriod(updatedPeriod);
      if (response.data?.success) {
        // setPeriods((prevPeriods) =>
        //   prevPeriods.map((per) =>
        //     per.periodId === updatedPeriod.periodId ? updatedPeriod : per
        //   )
        // );
        toast.success(`${updatedPeriod.periodName} Period Updated successfully!`);
        refetch();
        reset();
      } else {
        toast.error("Failed to update the period");
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
        <Button
          size="icon"
          variant="outline"
          className="h-7 w-7"
        >
          <Icon icon="heroicons:pencil" className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Edit Periods</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col justify-between" style={{ height: "calc(100vh - 80px)" }}>
          <div className="py-5">
            <hr />
            <form onSubmit={handleSubmit(onSubmit, handleError)}>
              <div className="grid grid-cols-2 gap-4">
              <div className="col-span-3">
                  <Select
                    value={periodId?.toString() ?? ""}
                    onValueChange={(value) =>
                      setValue("periodId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Period" />
                    </SelectTrigger>
                    <SelectContent>
                      {periodItem?.map((per) => (
                        <SelectItem
                          className="hover:bg-default-300"
                          key={per.periodId}
                          value={per.periodId?.toString() ?? ""}
                        >
                          {per.periodName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {errors.periodId && (
                    <p className="text-destructive">
                      {errors.periodId.message}
                    </p>
                  )}
                </div>  

                <div className="col-span-3">
                  <Label>Start Time</Label>
                  <Select
                    value={startTime?.toString() ?? ""}
                    onValueChange={(value) =>
                      setValue("startTime", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Period" />
                    </SelectTrigger>
                    <SelectContent>
                      {periodData
                      .map((per) => per.startTime)
                      .filter((value, index, self) => self.indexOf(value) === index)
                      .map((startTime) => (
                        <SelectItem
                          className="hover:bg-default-300"
                          key={startTime}
                          value={startTime?.toString() ?? ""}
                        >
                          {startTime}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {errors.startTime && (
                    <p className="text-destructive">
                      {errors.startTime.message}
                    </p>
                  )}
                </div>  
                
                
                <div className="col-span-3">
                <Label>End Time</Label>
                  <Select
                    defaultValue={endTime?.toString() ?? ""}
                    onValueChange={(value) =>
                      setValue("endTime", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Period" />
                    </SelectTrigger>
                    <SelectContent>
                      {periodData
                        .map((per) => per.endTime)
                        .filter((value, index, self) => self.indexOf(value) === index) // Filter duplicates
                        .map((endTime) => (
                          <SelectItem
                            className="hover:bg-default-300"
                            key={endTime}
                            value={endTime?.toString() ?? ""}
                          >
                            {endTime}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {errors.endTime && (
                    <p className="text-destructive">
                      {errors.endTime.message}
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
          <SheetClose asChild>
            <Button variant="ghost">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
