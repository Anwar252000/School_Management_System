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
import { FeeCategoryData, useUpdateFeeCategoryMutation } from "@/services/apis/feeCategoryService";

const feeCategorySchema = z.object({
  feeName: z.string().min(1, "Fee Name is required"),
  feeDescription: z.string().optional(),
  createdBy: z.number().optional(),
});

type ClassFormValues = z.infer<typeof feeCategorySchema>;

export default function EditFeeCategory({ feeCategoryData, refetch }: { feeCategoryData: FeeCategoryData; refetch: () => void }) {
  const [updateFeeCategory] = useUpdateFeeCategoryMutation();
  const { feeCategoryId, feeName, feeDescription } = feeCategoryData;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClassFormValues>({
    resolver: zodResolver(feeCategorySchema),
    defaultValues: {
      feeName,
      feeDescription,
    },
  });

  const onSubmit: SubmitHandler<ClassFormValues> = async (data) => {
    try {
      const updatedFeeCategory = { ...data, feeCategoryId };
      const response = await updateFeeCategory(updatedFeeCategory);

      if (response.data?.success) {
        toast.success(`${updatedFeeCategory.feeName} Updated successfully!`);
        reset();
        refetch();
      } else {
        toast.error("Failed to update Fee Category");
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
          <SheetTitle>Edit Fee Category</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col justify-between" style={{ height: "calc(100vh - 80px)" }}>
          <div className="py-5">
            <hr />
            <form onSubmit={handleSubmit(onSubmit, handleError)}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="Fee Name"
                    {...register("feeName")}
                  />
                  {errors.feeName && <p className="text-destructive">{errors.feeName.message}</p>}
                </div>
                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="Fee Description"
                    {...register("feeDescription")}
                  />
                  {errors.feeDescription && <p className="text-destructive">{errors.feeDescription?.message}</p>}
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
