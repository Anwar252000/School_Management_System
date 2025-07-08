"use client";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
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
import {
  EmployeesData,
  useFetchEmployeesQuery,
} from "@/services/apis/employeeService";
import {
  SubjectTeacherData,
  useUpdateSubjectTeacherMutation,
} from "@/services/apis/assignSubjectTeacherService";
import { SubjectData } from "@/services/apis/subjectService";

const subjectTeacherSchema = z.object({
  subjectTeacherId: z.coerce.number().optional(),
  employeeId: z.number().min(1, "Employee is required"),
  subjectIds: z.array(z.number().min(1, "Subject is Required")),
});

type SubjectTeacherFormValues = z.infer<typeof subjectTeacherSchema>;

export default function EditSubjectTeacher({
  subjectTeacherData,
  subjectData,
  refetch,
}: {
  subjectTeacherData: SubjectTeacherData;
  subjectData: SubjectData[];
  refetch: () => void;
}) {
  const { employeeId, subjectIds = [] } = subjectTeacherData || {};

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<SubjectTeacherFormValues>({
    resolver: zodResolver(subjectTeacherSchema),
    defaultValues: {
      employeeId,
      subjectIds,
    },
  });

  const { data: employeeData } = useFetchEmployeesQuery();
  const employees = (employeeData?.data as EmployeesData[]) || [];
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [updateSubjectTeacher] = useUpdateSubjectTeacherMutation();

  const subjectTeacher = employees.filter(
    (emp) => emp.employeeRoleName === "Teacher"
  );

  useEffect(() => {
    if (subjectTeacherData) {
      reset({
        employeeId: subjectTeacherData.employeeId ?? "",
        subjectIds: subjectTeacherData.subjectIds ?? [],
      });
    }
  }, [subjectTeacherData, reset]);

  const onSubmit: SubmitHandler<SubjectTeacherFormValues> = async (data) => {
    try {
      const updatedSubjectTeacher = { ...data, employeeId };
      const response = await updateSubjectTeacher(updatedSubjectTeacher);
      if (response.data?.success) {
        toast.success("Subject Teacher Updated successfully!");
        refetch();
        reset();
      } else {
        toast.error("Failed to update the Subject Teacher");
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
      console.log(currentSubjects, "currentSubjects");
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
          <SheetTitle>Edit Subject Teacher</SheetTitle>
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
                    defaultValue={employeeId.toString() ?? ""}
                    onValueChange={(value) =>
                      setValue("employeeId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectTeacher.map((employeeData) => (
                        <SelectItem
                          className="hover:bg-default-300"
                          key={employeeData.employeeId}
                          value={employeeData.employeeId?.toString() ?? ""}
                        >
                          {employeeData.firstName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.employeeId && (
                    <p className="text-destructive">
                      {errors.employeeId.message}
                    </p>
                  )}
                </div>
                <div className="col-span-6">
                  <label className="block mb-2">Select Subjects</label>
                  <div className="grid grid-cols-1 gap-4">
                    {subjectData.map((sub) => (
                      <div
                        key={sub.subjectId !== undefined ? sub.subjectId : 0}
                        className="flex items-center"
                      >
                        <Checkbox
                          variant="filled"
                          id={`subject-${sub.subjectId ?? 0}`}
                          defaultChecked={watch("subjectIds")?.includes(
                            sub.subjectId ?? 0
                          )}
                          checked={watch("subjectIds")?.includes(
                            sub.subjectId ?? 0
                          )}
                          onCheckedChange={(isChecked) =>
                            handleCheckboxChange(
                              sub.subjectId ?? 0,
                              Boolean(isChecked)
                            )
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
