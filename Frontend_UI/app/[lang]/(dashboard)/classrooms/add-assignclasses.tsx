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
import { ClassroomData } from "@/services/apis/classroomService";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionData } from "@/services/apis/sectionService";
import { ClassData } from "@/services/apis/classService";
import {
  ClassAssignData,
  useAddClassAssignmentMutation,
} from "@/services/apis/assignClassService";
import { CampusData } from "@/services/apis/campusService";

const assignclassesSchema = z.object({
  campusId: z.coerce.number(),
  classroomId: z.coerce.number(),
  classId: z.coerce.number(),
  sectionId: z.coerce.number(),
});

type AssignClassFormValues = z.infer<typeof assignclassesSchema>;
interface ClassAssignmentProps {
  classes: ClassData[];
  classroom: ClassroomData[];
  section: SectionData[];
  campus: CampusData[];
  assignClassData: ClassAssignData[];
  refetch: () => void;
}

export default function AddAssignClasses({
  classes,
  classroom,
  section,
  campus,
  assignClassData,
  refetch,
}: ClassAssignmentProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<AssignClassFormValues>({
    resolver: zodResolver(assignclassesSchema),
  });

  const [assignClass] = useAddClassAssignmentMutation();
  const selectedCampusId = watch("campusId");

  const filteredClassrooms = classroom?.filter(
    (classroomData) => classroomData.campusId === selectedCampusId
  );

  const onSubmit: SubmitHandler<AssignClassFormValues> = async (data) => {
    try {
      const response = await assignClass(data);
      if (response.data?.success) {
        const className = Array.isArray(response.data?.data)
          ? response.data?.data[0].className
          : response.data?.data.classId;
        toast.success(`${className} Class Assigned successfully!`);
        reset();
        refetch();
      } else {
        console.error("Error:", response);
        toast.error(
          `Error: ${response.data?.message || "Something went wrong"}`
        );
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Request Failed";
      console.error("Request Failed:", errorMessage);
      toast.error(errorMessage);
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
              className="w-6 h-6 mr-2  "
            />
          </span>
          Assign Classes
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Select Classroom / Class / Section</SheetTitle>
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
                    onValueChange={(value) =>
                      setValue("campusId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Campus" />
                    </SelectTrigger>
                    <SelectContent>
                      {campus?.map((campusData) => (
                        <SelectItem
                          className="hover:bg-default-300"
                          key={campusData.campusId}
                          value={campusData.campusId?.toString() ?? ""}
                        >
                          {campusData.campusName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {errors.campusId && (
                    <p className="text-destructive">
                      {errors.campusId.message}
                    </p>
                  )}
                </div>

                <div className="col-span-3">
                  <Select
                    onValueChange={(value) =>
                      setValue("classroomId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Classroom" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredClassrooms?.map((classroomData) => (
                        <SelectItem
                          className="hover:bg-default-300"
                          key={classroomData.classroomId}
                          value={classroomData.classroomId?.toString() ?? ""}
                        >
                          {classroomData.roomNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {errors.classroomId && (
                    <p className="text-destructive">
                      {errors.classroomId.message}
                    </p>
                  )}
                </div>

                <div className="col-span-3 ">
                  <Select
                    onValueChange={(value) =>
                      setValue("classId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Class" />
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
                <div className="col-span-2 lg:col-span-3">
                  <Select
                    onValueChange={(value) =>
                      setValue("sectionId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Section" />
                    </SelectTrigger>
                    <SelectContent>
                      {section?.map((sectionData) => (
                        <SelectItem
                          className="hover:bg-default-300"
                          key={sectionData.sectionId}
                          value={sectionData.sectionId?.toString() ?? ""}
                        >
                          {sectionData.sectionName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {errors.sectionId && (
                    <p className="text-destructive">
                      {errors.sectionId.message}
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
