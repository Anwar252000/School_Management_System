"use client"; // Make sure this is at the very top

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
  ClassroomData,
} from "@/services/apis/classroomService";
import {
  SectionData,
} from "@/services/apis/sectionService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClassAssignData, useUpdateClassAssignmentMutation } from "@/services/apis/assignClassService";
import { ClassData } from "@/services/apis/classService";
import { CampusData } from "@/services/apis/campusService";

const classassignmentSchema = z.object({
  campusId: z.number().min(1, "Campus is required"),
  classroomId: z.number().min(1, "Room Number is required"),
  classId: z.number().min(1, "Class is required"),
  sectionId: z.number().min(1, "Section is required"),
});

type ClassAssignFormValues = z.infer<typeof classassignmentSchema>;

interface ClassAssignmentProps {
  assignmentData: ClassAssignData[];
  classData: ClassData[];
  sectionData: SectionData[];
  classroomData: ClassroomData[];
  // campusData: CampusData[];
  refetch: () => void;
}

const EditClassSectionAssign: React.FC<ClassAssignmentProps> = ({
  assignmentData,
  classData,
  sectionData,
  classroomData,
  // campusData,
  refetch,
}) => {
  const { classroomId, classId, sectionId, campusId, assignmentId } =
    assignmentData[0];

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ClassAssignFormValues>({
    resolver: zodResolver(classassignmentSchema),
    defaultValues: {
      classroomId,
      classId,
      sectionId,
      campusId,
    },
  });

  const [updateClassAssignment] = useUpdateClassAssignmentMutation();

  const onSubmit: SubmitHandler<ClassAssignFormValues> = async (data) => {
    try {
      const updatedClassAssignment = { ...data, assignmentId };
      const response = await updateClassAssignment(updatedClassAssignment);
      if (response.data?.success) {
        toast.success("Class Assignment Updated successfully!");
        reset();
        refetch();
      } else {
        toast.error("Failed to update the class assignment");
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
        <Button size="icon" variant="outline" className="h-7 w-7">
          <Icon icon="heroicons:pencil" className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Edit Class Assignment</SheetTitle>
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
                    defaultValue={campusId?.toString() ?? ""}
                    onValueChange={(value) =>
                      setValue("campusId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Campus" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignmentData.map((campuses) => (
                        <SelectItem
                          className="hover:bg-default-300"
                          key={campuses.campusId}
                          value={campuses.campusId?.toString() ?? ""}
                        >
                          {campuses.campusName}
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
                    defaultValue={classroomId?.toString() ?? ""}
                    onValueChange={(value) =>
                      setValue("classroomId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Classroom" />
                    </SelectTrigger>
                    <SelectContent>
                      {classroomData.map((classroom) => (
                        <SelectItem
                          className="hover:bg-default-300"
                          key={classroom.classroomId}
                          value={classroom.classroomId?.toString() ?? ""}
                        >
                          {classroom.roomNumber}
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
                    defaultValue={classId?.toString() ?? ""}
                    onValueChange={(value) =>
                      setValue("classId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classData.map((classData) => (
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
                    defaultValue={sectionId?.toString() ?? ""}
                    onValueChange={(value) =>
                      setValue("sectionId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectionData.map((section) => (
                        <SelectItem
                          className="hover:bg-default-300"
                          key={section.sectionId}
                          value={section.sectionId?.toString() ?? ""}
                        >
                          {section.sectionName}
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
};
export default EditClassSectionAssign;
