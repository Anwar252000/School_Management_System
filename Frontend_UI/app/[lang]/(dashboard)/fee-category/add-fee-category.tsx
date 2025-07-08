"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import useAuth from "@/hooks/use-auth";
import { useAddFeeCategoryMutation } from "@/services/apis/feeCategoryService";

const feeCategorySchema = z.object({
  feeName: z.string().min(1, "Fee Name is required"),
  feeDescription: z.string().optional(),
  createdBy: z.number().optional(),
});

type ClassFormValues = z.infer<typeof feeCategorySchema>;

interface FeeCategoriesProps {
  refetch: () => void;
}
export default function AddFeeCategory({refetch}: FeeCategoriesProps) {
  const [AddFeeCategory] = useAddFeeCategoryMutation();

  const {userId} = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(feeCategorySchema),
  });
  
  const onSubmit: SubmitHandler<ClassFormValues> = async (data) => {
    
    try {
      const payload = {
        ...data,
        createdBy: userId || 0,
      }
      const response = await AddFeeCategory(payload);
      
      if (response?.data?.success) {
        const feeName = Array.isArray(response.data?.data)
          ? response.data?.data[0].feeName 
          : response.data?.data.feeName;
        toast.success(`${feeName} Added successfully!`);
        refetch();
        reset();
      } else {
        toast.error(`Error: ${response?.data?.message || "Something went wrong"}`);
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
            <Icon icon="heroicons:building-library-solid" className="w-6 h-6 mr-2" />
          </span>
          Add Fee Category
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add New Fee Category</SheetTitle>
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
                    placeholder="Fee Name"
                    {...register("feeName")}
                  />
                  {errors.feeName && (
                    <p className="text-destructive">
                      {errors.feeName.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Textarea
                    placeholder="Fee Description"
                    {...register("feeDescription")}
                  />
                  {errors.feeDescription && (
                    <p className="text-destructive">
                      {errors.feeDescription.message}
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
