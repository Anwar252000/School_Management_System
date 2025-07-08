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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AssignClassSubjectData, useUpdateClassSubjectMutation } from "@/services/apis/assignClassSubjectService";
import { SubjectData } from "@/services/apis/subjectService";
import { ClassData } from "@/services/apis/classService";

const subjectAssignmentSchema = z.object({
  classSubjectId: z.number().optional(),
  classId: z.number().min(1, "Class is required"),
  subjectIds: z.array(z.number().min(1, "Subject is Required")),
  isActive: z.boolean().optional(),
});

type SubjectAssignFormValues = z.infer<typeof subjectAssignmentSchema>;

export default function EditClassSubjectAssign({
  subjectAssignmentData,
  subject,
  classes,
  refetch,
}: {
  subjectAssignmentData: AssignClassSubjectData[];
  subject: SubjectData[];
  classes: ClassData[];
  refetch: () => void;
}) {
  const { classId, subjectIds = [], classSubjectId } = subjectAssignmentData[0]; 
  
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<SubjectAssignFormValues>({
    resolver: zodResolver(subjectAssignmentSchema),
    defaultValues: {
      classId,
      subjectIds, 
    },
  });

  useEffect(() => {
    if (subjectAssignmentData?.length > 0&& subjectAssignmentData[0].subjects) {
      const { subjects } = subjectAssignmentData[0]; // Subjects from data
      const subjectIds = subjects
        .map((name) =>
          subject.find((subj) => subj.subjectName.trim() === name.trim())
        )
        .filter(Boolean) // Exclude unmatched subjects
        .map((match) => match?.subjectId);
  
        setValue("subjectIds", subjectIds.filter((id) => id !== undefined) ?? []); // Set only the relevant subjectIds
    }
  }, [subjectAssignmentData, subject, setValue]);


  const [updateClassSubjectAssignment] = useUpdateClassSubjectMutation();

  const onSubmit: SubmitHandler<SubjectAssignFormValues> = async (data) => {
    try {
      const updatedSubjectAssignment = { ...data, classId };
      const response = await updateClassSubjectAssignment(
        updatedSubjectAssignment
      );
      if (response.data?.success) {
        toast.success("Subject Assignment Updated successfully!");
        refetch();
        reset();
      } else {
        toast.error("Failed to update the Subject assignment");
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

  const handleCheckboxChange = (subjectId: number, isChecked: boolean) => {
    const currentSubjects = watch("subjectIds") ?? [];

    if (isChecked) {
      setValue("subjectIds", [...currentSubjects, subjectId]);
    } else {
      setValue(
        "subjectIds",
        currentSubjects.filter((id: number) => id !== subjectId)
      );
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
          <SheetTitle>Edit Subject Assignment</SheetTitle>
        </SheetHeader>
        <div
          className="flex flex-col justify-between"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="py-5">
            <hr />
            <form onSubmit={handleSubmit(onSubmit, handleError)}>
              <div className="grid grid-cols-6 gap-4 mt-5">
                <div className="col-span-3">
                  <Select
                    defaultValue={classId?.toString() ?? ""}
                    onValueChange={(value) =>
                      setValue("classId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes?.map((classData) => (
                        <SelectItem
                          className="hover:bg-default-300"
                          key={classData.classId}
                          value={classData.classId?.toString() ?? ""}
                        >
                          {classData.className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {errors.classId && (
                    <p className="text-destructive">{errors.classId.message}</p>
                  )}
                </div>

                <div className="col-span-6">
                  <label className="block mb-2">Select Subjects</label>
                  <div className="grid grid-cols-1 gap-4">
                    {/* {subject?.map((sub) => (
                      <div
                        key={sub.subjectId !== undefined ? sub.subjectId : 0}
                        className="flex items-center"
                      >
                        <Checkbox
                          variant="filled"
                          id={`subject-${sub.subjectId ?? 0}`}
                          // defaultChecked={watch("subjectIds")?.includes(
                          //   sub.subjectId ?? 0
                          // )}
                          checked={watch("subjectIds")?.includes(
                            sub.subjectId ?? 0
                          )} // Controlled checkbox state
                          onCheckedChange={(
                            isChecked
                          ) =>
                            handleCheckboxChange(
                              sub.subjectId ?? 0,
                              Boolean(isChecked)) // Ensure isChecked is a boolean
                          }
                          className="mr-2"
                        >
                          {sub.subjectName}
                        </Checkbox>
                      </div>
                    ))} */}
                    {subject?.filter((sub) => sub.subjectId !== undefined).map((sub) => (
                      <div key={sub.subjectId} className="flex items-center">
                        <Checkbox
                          variant="filled"
                          id={`subject-${sub.subjectId}`}
                          checked={watch("subjectIds")?.includes(sub.subjectId as number)}
                          onCheckedChange={(isChecked) =>
                            handleCheckboxChange(sub.subjectId ?? 0, Boolean(isChecked))
                          }
                          className="mr-2"
                        >
                          {sub.subjectName}
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                  {errors.subjectIds && (
                    <p className="text-destructive">
                      {errors.subjectIds.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <Button type="submit">Update Form</Button>
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

