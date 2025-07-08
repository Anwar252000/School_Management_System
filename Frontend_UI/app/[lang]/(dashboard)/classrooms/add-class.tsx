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
import { useAddClassMutation } from "@/services/apis/classService";
import useAuth from "@/hooks/use-auth";

const classSchema = z.object({
  className: z.string().min(1, "Class Name is required"),
  capacity: z.number().min(1, "Capacity is required").max(999),
  classDescription: z.string().optional(),
  createdBy: z.number().optional(),
});

type ClassFormValues = z.infer<typeof classSchema>;

interface ClassProps {
  refetch: () => void;
}
export default function AddClass({refetch}: ClassProps) {
  const [addClass] = useAddClassMutation();

  const {userId} = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
  });
  
  const onSubmit: SubmitHandler<ClassFormValues> = async (data) => {
    
    try {
      const payload = {
        ...data,
        createdBy: userId || 0,
      }
      const response = await addClass(payload);
      
      if (response?.data?.success) {
        const className = Array.isArray(response.data?.data)
          ? response.data?.data[0].className 
          : response.data?.data.className;
        toast.success(`${className} Class Added successfully!`);
        refetch();
        reset();
      } else {
        console.error("Error:", response);
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
          Add Class
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add New Class</SheetTitle>
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
                    placeholder="Class Name"
                    {...register("className")}
                  />
                  {errors.className && (
                    <p className="text-destructive">
                      {errors.className.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Capacity"
                    {...register("capacity", {valueAsNumber: true})}
                  />
                  {errors.capacity && (
                    <p className="text-destructive">{errors.capacity.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <Textarea
                    placeholder="Class Description"
                    {...register("classDescription")}
                  />
                  {errors.classDescription && (
                    <p className="text-destructive">
                      {errors.classDescription.message}
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
