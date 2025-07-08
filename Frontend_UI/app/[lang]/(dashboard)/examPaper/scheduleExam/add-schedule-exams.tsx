"use client";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import 'react-quill/dist/quill.snow.css';
import { useAddExamMutation } from "@/services/apis/examService";
import { ClassData } from "@/services/apis/classService";
import { CampusData, useFetchCampusesQuery } from "@/services/apis/campusService";
import { AssignClassSubjectData } from "@/services/apis/assignClassSubjectService";
import { ExamPaperData, useFetchExamPapersQuery } from "@/services/apis/examPaperService";

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

type ExamsScheduleFormValues = z.infer<typeof scheduleExamsSchema>;

interface DataProps{
    classes: ClassData[];
    subject: AssignClassSubjectData[];
    refetch: () => void
}
export default function AddScheduleExams({ classes, subject, refetch }: DataProps) {
  const {data: campus, isLoading, isError,} = useFetchCampusesQuery();
  const campusData = campus?.data as CampusData[];
  const [addExams] = useAddExamMutation();
  const {data: examPaperData} = useFetchExamPapersQuery();
  const examPaper = examPaperData?.data as ExamPaperData[];

  const {
    register,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ExamsScheduleFormValues>({
    resolver: zodResolver(scheduleExamsSchema),
  });

  const selectedClassId = watch("classId");
  const selectedSubjectId = watch("subjectId");

  const filteredClassSubjects = subject?.filter(
    (subjects) => subjects.classId === selectedClassId && subjects.isActive
  );

  const filteredExamPapers = examPaper?.filter(
    (exams) => exams.classId === selectedClassId && exams.subjectId === selectedSubjectId && exams.isActive
  ) 

  const onSubmit: SubmitHandler<ExamsScheduleFormValues> = async (data) => {
    console.log("Data Submitted", data);

    const formattedStartTime = data.startTime.length === 5 ? `${data.startTime}:00` : data.startTime;
    const formattedEndTime = data.endTime.length === 5 ? `${data.endTime}:00` : data.endTime;
  
    const formData = {
      ...data,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    
    };
    try {
      const response = await addExams(formData);
      if (response.data?.success) {
        toast.success(`Exams scheduled successfully!`);
        refetch();
        reset();
      } else {
        toast.error(`Error: ${response.data?.message || "Something went wrong"}`);
      }
    } catch (error) {
      toast.error("Request Failed");
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
          Schedule Exams
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add a Schedule</SheetTitle>
        </SheetHeader>

        <div
          className="flex flex-col justify-between"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="py-5">
            <hr />
            <form onSubmit={handleSubmit((onSubmit))}>
              <div className="grid grid-cols-2 mt-3 gap-4">
                <div className="col-span-1">
                  <Label>Select Campus</Label>
                  <Select onValueChange={(value) => setValue("campusId", parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Campus" />
                    </SelectTrigger>
                    <SelectContent>
                      {campusData?.map((c) => (
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
                  <Select onValueChange={(value) => setValue("classId", parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes?.map((e) => (
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
                  <Select onValueChange={(value) => setValue("subjectId", parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredClassSubjects?.map((e) => (
                        <SelectItem key={e.subjectName} value={e.subjectIds?.toString() || ''}>
                          {e.subjectName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> 
                  {errors.classId && <p className="text-destructive">{errors.classId.message}</p>}
                </div>

                <div className="col-span-1">
                  <Label>Select Term</Label>
                  <Select onValueChange={(value) => setValue("examPaperId", parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ExamPaper" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        ...new Map(
                          filteredExamPapers?.map((e) => [
                            `${e.classId}-${e.subjectId}-${e.termName}`,
                            { termName: e.termName, examPaperId: e.examPaperId },
                          ])
                        ).values(),
                      ].map(({ termName, examPaperId }) => (
                        <SelectItem key={examPaperId} value={examPaperId?.toString() ?? ''}>
                          {termName}
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
                  />
                  {errors.examDate && (<p className="text-destructive">{errors.examDate.message}</p>)}
                </div>
              
                <div className="col-span-1">
                  <Label>Select Start Time</Label>
                  <Input
                    type="time"
                    placeholder="Start Time"
                    {...register("startTime")}
                  />
                  {errors.startTime && (<p className="text-destructive">{errors.startTime.message}</p>)}
                </div>

                <div className="col-span-1">
                  <Label>Select End Time</Label>
                  <Input
                    type="time"
                    placeholder="End Time"
                    {...register("endTime")}
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
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};