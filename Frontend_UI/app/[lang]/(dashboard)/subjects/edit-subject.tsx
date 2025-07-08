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
import { SubjectData, useUpdateSubjectMutation } from "@/services/apis/subjectService";

// Define Zod schema for class form validation
const subjectSchema = z.object({
  subjectId: z.number().int().positive().optional(),
  subjectName: z.string().min(1, "Subject Name is required"),
  subjectDescription: z.string().min(1).optional(),
});

type SubjectFormValues = z.infer<typeof subjectSchema>;

export default function EditSubject({ subject, refetch }: { 
  subject: SubjectData;
  refetch: () => void;
}) {
  
  const { subjectId, subjectName, subjectDescription } = subject;
  const [updateSubject] = useUpdateSubjectMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      subjectName, 
      subjectDescription,
    },
  });

  const onSubmit: SubmitHandler<SubjectFormValues> = async (data) => {
    try {
      const updatedSubject = { ...data, subjectId };
      const response = await updateSubject(updatedSubject);
      if (response.data?.success) {
        toast.success(`${updatedSubject.subjectName} Subject Updated successfully!`);
        refetch();
        reset();
      } else {
        toast.error("Failed to update the Subject");
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
          <SheetTitle>Edit Subject</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col justify-between" style={{ height: "calc(100vh - 80px)" }}>
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
                  {errors.subjectName && <p className="text-destructive">{errors.subjectName.message}</p>}
                </div>
                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="Subjec Description"
                    {...register("subjectDescription")}
                  />
                  {errors.subjectDescription && <p className="text-destructive">{errors.subjectDescription?.message}</p>}
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
