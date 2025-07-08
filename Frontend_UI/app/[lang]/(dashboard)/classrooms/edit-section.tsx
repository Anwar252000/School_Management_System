"use client"; // Make sure this is at the very top

import React from "react";
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
  useUpdateSectionMutation,
} from "@/services/apis/sectionService";

const sectionSchema = z.object({
  sectionName: z.string().min(1, "Class Name is required"),
  capacity: z.number().min(1, "Capacity is required").max(999),
});

type ClassFormValues = z.infer<typeof sectionSchema>;

export default function EditSection({
  sectionData,
  refetch,
}: {
  sectionData: SectionData;
  refetch: () => void;
}) {
  const { sectionId, capacity, sectionName } = sectionData;
  const [editSection] = useUpdateSectionMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      sectionName,
      capacity,
    },
  });

  const onSubmit: SubmitHandler<ClassFormValues> = async (data) => {
    try {
      const updatedSection = { ...data, sectionId: sectionId ?? 0 };
      const response = await editSection(updatedSection);

      if (response.data?.success) {
        toast.success(
          `${updatedSection.sectionName} Section Updated successfully!`
        );
        reset();
        refetch();
      } else {
        toast.error("Failed to update the Section");
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
        <Button size="icon" variant="outline" className="h-7 w-7">
          <Icon icon="heroicons:pencil" className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Edit Section</SheetTitle>
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
