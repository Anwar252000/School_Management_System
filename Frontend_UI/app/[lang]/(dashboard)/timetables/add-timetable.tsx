"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClassData } from '@/services/apis/classService';
import { CampusData } from '@/services/apis/campusService';
import { AssignClassSubjectData } from '@/services/apis/assignClassSubjectService';
import { PeriodData } from '@/services/apis/periodService';
import { useAddTimeTableMutation } from '@/services/apis/timetableService';

const addTimeTableSchema = z.object({
  timetableId: z.coerce.number().optional(),
  campusId: z.coerce.number().min(1, "Campus is required"),
  classId: z.coerce.number().min(1, "Class is required"),
  subjectId: z.coerce.number().min(1, "Subject is required"),
  periodId: z.coerce.number().min(1, "Period is required"),
  dayOfWeek: z.string().min(1, "Day is required"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  periodName: z.string().optional(),
  subjectName: z.string().optional()
});

type AddTimeTableFormValues = z.infer<typeof addTimeTableSchema>;

interface TimeTableProps {
  classes: ClassData[];
  campus: CampusData[];
  subject: AssignClassSubjectData[];
  periods: PeriodData[];
  refetch: () => void;
}

export default function AddTimeTable({ classes, campus, subject, periods, refetch }: TimeTableProps) {
  const [addTimeTable] = useAddTimeTableMutation();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddTimeTableFormValues>({
    resolver: zodResolver(addTimeTableSchema),
  });

  const selectedClassId = watch("classId");

  const filteredClassSubjects = subject?.filter(
    (assignSubject) => assignSubject.classId === selectedClassId && assignSubject.isActive
  );

  const onSubmit: SubmitHandler<AddTimeTableFormValues> = async (data) => {
    try {
      const response = await addTimeTable(data);
      if (response.data?.success) {
        toast.success('Time Table added successfully!');
        reset();
        refetch();
      } else {
        toast.error(response.data?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Request Failed");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Icon
            icon="heroicons:building-library-solid"
            className="w-6 h-6 mr-2"
          />
          Add Time Table
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add Time Table</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col py-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-3">
                <Label>Campus</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("campusId", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Campus" />
                  </SelectTrigger>
                  <SelectContent>
                    {campus?.map((campusData) => (
                      <SelectItem key={campusData?.campusId ?? ''} value={campusData?.campusId?.toString() ?? ''}>
                        {campusData.campusName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.campusId && (
                  <p className="text-destructive">{errors.campusId.message}</p>
                )}
              </div>

              <div className="col-span-3">
                <Label>Class</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("classId", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes?.map((classData) => (
                      <SelectItem key={classData?.classId ?? ''} value={classData?.classId?.toString() ?? ''}>
                        {classData.className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.classId && (
                  <p className="text-destructive">{errors.classId.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-6 gap-4 mt-5">
              <div className="col-span-2">
                <Label>Day</Label>
                <Select onValueChange={(value) => setValue("dayOfWeek", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monday">Monday</SelectItem>
                    <SelectItem value="Tuesday">Tuesday</SelectItem>
                    <SelectItem value="Wednesday">Wednesday</SelectItem>
                    <SelectItem value="Thursday">Thursday</SelectItem>
                    <SelectItem value="Friday">Friday</SelectItem>
                    <SelectItem value="Saturday">Saturday</SelectItem>
                  </SelectContent>
                </Select>
                {errors.dayOfWeek && (
                  <p className="text-destructive">{errors.dayOfWeek.message}</p>
                )}
              </div>

              <div className="col-span-2">
                <Label>Class Periods</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("periodId", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Periods" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods?.map((periodData) => (
                      <SelectItem key={periodData?.periodId ?? ''} value={periodData?.periodId?.toString() ?? ''}>
                        {periodData.periodName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.periodId && (
                  <p className="text-destructive">{errors.periodId.message}</p>
                )}
              </div>

              <div className="col-span-2">
                <Label>Subject</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("subjectId", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredClassSubjects?.map((subjectData) => (
                      <SelectItem key={subjectData?.classSubjectId} value={subjectData.subjectIds?.toString() || ''}>
                        {subjectData.subjectName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subjectId && (
                  <p className="text-destructive">{errors.subjectId.message}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </div>
        <SheetFooter>
          <SheetClose asChild>Footer Content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
