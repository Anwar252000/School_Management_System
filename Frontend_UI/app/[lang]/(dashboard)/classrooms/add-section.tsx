"use client";
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

import {
  SectionData,
  useAddSectionMutation,
} from "@/services/apis/sectionService";
import { ClassData, useFetchClassQuery } from "@/services/apis/classService";
import useAuth from "@/hooks/use-auth";

const sectionSchema = z.object({
  sectionName: z.string().min(1, "Section Name is required"),
  capacity: z.number().min(1, "Capacity is required").max(999),
  createdBy: z.number().optional(),
});

type SectionFormValues = z.infer<typeof sectionSchema>;

export default function AddSection({ refetch }: { refetch: () => void }) {
  const [addSection] = useAddSectionMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
  });

  const {userId} = useAuth();

  const onSubmit: SubmitHandler<SectionFormValues> = async (data) => {
    try {
      const payload = {
        ...data,
        createdBy: userId || 0,
      }
      const response = await addSection(payload as SectionData);
      if (response.data?.success) {
        toast.success(
          `${response.data?.data.sectionName} Section Added successfully!`
        );
        reset();
        refetch();
      } else {
        console.error("Error:", response);
        toast.error(
          `Error: ${response.data?.message || "Something went wrong"}`
        );
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
        <Button>
          <span className="text-xl mr-1">
            <Icon
              icon="heroicons:building-library-solid"
              className="w-6 h-6 mr-2"
            />
          </span>
          Add Section
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add New Section</SheetTitle>
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
                  <Input
                    type="text"
                    placeholder="Section Name"
                    {...register("sectionName")}
                  />
                  {errors.sectionName && (
                    <p className="text-destructive">
                      {errors.sectionName.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Capacity"
                    {...register("capacity", { valueAsNumber: true })}
                  />
                  {errors.capacity && (
                    <p className="text-destructive">
                      {errors.capacity.message}
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
