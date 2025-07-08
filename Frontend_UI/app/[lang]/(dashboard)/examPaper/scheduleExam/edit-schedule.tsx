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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ExamData, useUpdateExamMutation } from "@/services/apis/examService";

const scheduleExamsSchema = z.object({
  examId: z.coerce.number().optional(),
  examPaperId: z.coerce.number(),
  campusId: z.coerce.number(),
  classId: z.coerce.number(),
  subjectId: z.coerce.number(),
  passingMarks: z.coerce.number().min(1, "Passing Marks are required"),
  campusName: z.string().optional(),
  className: z.string().optional(),
  subjectName: z.string().optional(),
  termName: z.string().optional(),
  examDate: z.string().min(1, "Exam Date is required"),
  startTime: z.string().min(1, "Invalid Time Format"),
  endTime: z.string().min(1, "Invalid Time Format"),
  isActive: z.boolean().optional().default(true),
});

type EditScheduleFormValues = z.infer<typeof scheduleExamsSchema>;

export default function EditExamSchedule({ examItem, refetch }: {
  examItem: ExamData[]
  refetch: () => void
}) {

  const [updateExam] = useUpdateExamMutation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {examId, examPaperId, campusId, classId, subjectId, passingMarks, campusName, className, subjectName, termName, examDate, startTime, endTime, isActive } = examItem[0];

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EditScheduleFormValues>({
    resolver: zodResolver(scheduleExamsSchema),
    defaultValues: {
      examId,
      examPaperId,
      campusId,
      classId,
      subjectId,
      passingMarks,
      examDate,
      startTime,
      endTime,
      isActive,
    },
  });

  const onSubmit: SubmitHandler<EditScheduleFormValues> = async (data) => {
    const formattedStartTime = data.startTime.length === 5 ? `${data.startTime}:00` : data.startTime;
    const formattedEndTime = data.endTime.length === 5 ? `${data.endTime}:00` : data.endTime;
  
    const formData = {
      ...data,
      examId,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    
    };
    try {
      const response = await updateExam(formData);
      if (response.data?.success) {
        toast.success(`Exam Schedule for ${formData.className} Updated successfully!`);
        refetch();
        reset();
      } else {
        toast.error("Failed to update the Exam Schedule");
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
          <Icon icon="heroicons:pencil" className="flex h-4 w-4 " />
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Edit Schedule</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col justify-between" style={{ height: "calc(100vh - 80px)" }}>
          <div className="py-5">
            <hr />
            <form onSubmit={handleSubmit((onSubmit))}>
              <div className="grid grid-cols-2 mt-3 gap-4">
                <div className="col-span-1">
                  <Label>Select Campus</Label>
                  <Select onValueChange={(value) => setValue("campusId", parseInt(value))}
                    defaultValue={campusId.toString()}
                    >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Campus" />
                    </SelectTrigger>
                    <SelectContent>
                      {examItem.map((c) => (
                        <SelectItem key={c?.campusId ?? ''} value={c?.campusId?.toString() ?? ''}>
                          {c.campusName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.campusId && <p className="text-destructive">{errors.campusId.message}</p>}
                </div>

                <div className="col-span-1">
                  <Label>Select Class</Label>
                  <Select onValueChange={(value) => setValue("classId", parseInt(value))}
                    defaultValue={classId.toString()}
                    >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {examItem.map((e) => (
                        <SelectItem key={e.classId} value={e.classId?.toString() ?? ''}>
                          {e.className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.classId && <p className="text-destructive">{errors.classId.message}</p>}
                </div>

                <div className="col-span-1">
                  <Label>Select Subject</Label>
                  <Select onValueChange={(value) => setValue("subjectId", parseInt(value))}
                    defaultValue={subjectId.toString()}
                    >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {examItem.map((e) => (
                        <SelectItem key={e.subjectId} value={e.subjectId.toString() ?? ''}>
                          {e.subjectName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> 
                  {errors.classId && <p className="text-destructive">{errors.classId.message}</p>}
                </div>

                <div className="col-span-1">
                  <Label>Select Term</Label>
                  <Select onValueChange={(value) => setValue("examPaperId", parseInt(value))}
                    defaultValue={examPaperId?.toString()}
                    >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ExamPaper" />
                    </SelectTrigger>
                    <SelectContent>
                      {examItem.map((e) => (
                        <SelectItem key={e.examPaperId} value={e.examPaperId.toString() ?? ''}>
                          {e.termName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.examPaperId && <p className="text-destructive">{errors.examPaperId.message}</p>}
                </div>

                <div className="col-span-1">
                <Label>Passing Marks</Label>
                <Input
                  type="number"
                  placeholder="Passing Marks"
                  {...register("passingMarks", { valueAsNumber: true })}
                  defaultValue={passingMarks}
                />
                {errors.passingMarks && (
                  <p className="text-destructive">{errors.passingMarks.message}</p>
                )}
              </div>

                <div className="col-span-1">
                  <Label>Select Date</Label>
                  <Input
                    type="date"
                    placeholder="Exam Date"
                    {...register("examDate")}
                    defaultValue={examDate}
                  />
                  {errors.examDate && (<p className="text-destructive">{errors.examDate.message}</p>)}
                </div>
              
                <div className="col-span-1">
                  <Label>Select Start Time</Label>
                  <Input
                    type="time"
                    placeholder="Start Time"
                    {...register("startTime")}
                    defaultValue={startTime}
                  />
                  {errors.startTime && (<p className="text-destructive">{errors.startTime.message}</p>)}
                </div>

                <div className="col-span-1">
                  <Label>Select End Time</Label>
                  <Input
                    type="time"
                    placeholder="End Time"
                    {...register("endTime")}
                    defaultValue={endTime}
                  />
                  {errors.endTime && (<p className="text-destructive">{errors.endTime.message}</p>)}
                </div>
               
                <div className="col-span-2">
                  <Button type="submit">Submit Form</Button>
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
