"use client";
import React, { useState } from "react";
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
} from "@/components/ui/sheet"; // Adjusted service import
import { useAddSubjectMutation } from "@/services/apis/subjectService";

const subjectSchema = z.object({
  subjectId: z.number().int().positive().optional(),
  subjectName: z.string().min(1, "Subject Name is required"),
  subjectDescription: z.string().min(1).optional(),
});

type SubjectFormValues = z.infer<typeof subjectSchema>;
interface SubjectProps{
  refetch: () => void;
}
const AddSubject = ({refetch}: SubjectProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
  });

  const [addSubject] = useAddSubjectMutation();
  const onSubmit: SubmitHandler<SubjectFormValues> = async (data) => {
    try {
      const response = await addSubject(data); // Corrected function call
      if (response.data?.success) {
        toast.success(`Subject ${data.subjectName} added successfully!`);
        refetch();
        reset();
      } else {
        console.error("Error:", response);
        toast.error(`Error: ${response.data?.message || "Something went wrong"}`);
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
          Add Subject
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add New Subject</SheetTitle>
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
                    placeholder="Subject Name"
                    {...register("subjectName")}
                  />
                  {errors.subjectName && (
                    <p className="text-destructive">
                      {errors.subjectName.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="Subject Description"
                    {...register("subjectDescription")}
                  />
                  {errors.subjectDescription && (
                    <p className="text-destructive">
                      {errors.subjectDescription.message}
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
};
export default AddSubject;
