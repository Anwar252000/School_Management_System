"use client";
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
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ClassData } from "@/services/apis/classService";
import { SubjectData } from "@/services/apis/subjectService";
import { useAddClassSubjectMutation } from "@/services/apis/assignClassSubjectService";

const assignSubjectsSchema = z.object({
  classSubjectId: z.coerce.number().optional(),
  classId: z.coerce.number(),
  subjectIds: z.array(z.number().min(1, "Subject is Required")),
});

type AssignSubjectFormValues = z.infer<typeof assignSubjectsSchema>;

export default function AddAssignSubject({
  classes,
  subject,
  refetch
}: {
  classes: ClassData[];
  subject: SubjectData[];
  refetch: () => void
}) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    watch,
  } = useForm<AssignSubjectFormValues>({
    resolver: zodResolver(assignSubjectsSchema),
  });

  const [addClassSubjectAssignment] = useAddClassSubjectMutation();
  const onSubmit: SubmitHandler<AssignSubjectFormValues> = async (data) => {
    try {
      const response = await addClassSubjectAssignment(data);
      if (response.data?.success) {
        toast.success("Subject Assigned successfully!");
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
      console.error("Form errors:", errors);
      toast.error("Please correct the errors in the form.");
    }
  };

  // Multi-select using checkboxes for subjects
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
        <Button>
          <span className="text-xl mr-1">
            <Icon
              icon="heroicons:building-library-solid"
              className="w-6 h-6 mr-2"
            />
          </span>
          Assign Subjects To Class
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Select Subjects</SheetTitle>
        </SheetHeader>
        <div
          className="flex flex-col justify-between"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="py-5 ">
            <hr />
            {/* form */}
            <form onSubmit={handleSubmit(onSubmit, handleError)}>
              <div className="grid grid-cols-6 gap-4 mt-5">
                <div className="col-span-3">
                  <Select
                    onValueChange={(value) => {
                      setValue("classId", parseInt(value));
                    }}
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
                    {subject?.map((sub) => (
                      <div
                        key={sub.subjectId !== undefined ? sub.subjectId : 0}
                        className="flex items-center"
                      >
                        <Checkbox
                          variant="filled"
                          id={`subject-${sub.subjectId ?? 0}`} // Simplified ternary check
                          checked={watch("subjectIds")?.includes(
                            sub.subjectId ?? 0
                          )} // Controlled checkbox state
                          onCheckedChange={
                            (isChecked) =>
                              handleCheckboxChange(
                                sub.subjectId ?? 0,
                                Boolean(isChecked)
                              ) // Ensure isChecked is a boolean
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
