"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClassData, useFetchClassQuery } from "@/services/apis/classService";
import {
  SectionData,
  useFetchSectionQuery,
} from "@/services/apis/sectionService";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  StudentAcademicData,
  useFetchStudentAcademicQuery,
  usePromoteStudentAcademicMutation,
} from "@/services/apis/studentAcademicService";
import useAuth from "@/hooks/use-auth";
import { toast } from "sonner";

interface StudentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentClassName?: string | null;
  grade: string;
  campusId: number;
  studentId: number;
  studentAcademicId?: number | null;
}

const StudentDialog: React.FC<StudentDialogProps> = ({
  isOpen,
  onClose,
  studentName,
  studentClassName,
  grade,
  studentId,
  campusId,
  studentAcademicId,
}) => {
  const { register, handleSubmit, control, setValue, watch, reset } = useForm();
  const classId = watch("classId");

  // Fetch class and section data
  const { data: classData } = useFetchClassQuery();
  const classes = (classData?.data as ClassData[]) || [];

  const { data: sectionData } = useFetchSectionQuery();
  const sections = (sectionData?.data as SectionData[]) || [];
  const filteredSections = sections.filter(
    (sec) => sec.classId === Number(classId)
  );

  console.log("StudentAcademic", studentAcademicId);

  // Mutation hook
  const [promoteStudent, { isLoading }] = usePromoteStudentAcademicMutation();

  // Reset section when class changes
  useEffect(() => {
    setValue("sectionId", "");
  }, [classId, setValue]);

  // Generate academic year dynamically
  const currentYear = new Date().getFullYear();
  const academicYear = `${currentYear}-${currentYear + 1}`;

  // Get userId from auth
  const { userId } = useAuth();

  const onSubmit = async (data: any) => {
    const payload: StudentAcademicData = {
      studentAcademicId: studentAcademicId,
      studentId,
      campusId: campusId,
      classId: Number(data.classId),
      sectionId: Number(data.sectionId),
      academicYear,
      isPromoted: true,
      promotionDate: new Date().toISOString(),
      remarks: data.remarks,
      createdBy: userId || 0,
      isStudied: true,
      isActive: true,
    };

    try {
      const response = await promoteStudent(payload).unwrap();
      if (response.success) {
        toast.success("Student promoted successfully!");
        reset();
        onClose(); // Close modal after successful submission
      } else {
        toast.error(`Error: ${response.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Promotion Error:", error);
      toast.error("Failed to promote student. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Student Academic Record
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between text-sm font-medium">
            <div>
              <p>Student Name: {studentName}</p>
              <p>Class: {studentClassName || "N/A"}</p>
              <p>Grade: {grade}</p>
              <p>Academic Year: {academicYear}</p>
            </div>
            <p>Current Date: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="flex gap-4 my-4">
            <div className="flex flex-col w-1/2">
              <Label>Select Class</Label>
              <Controller
                name="classId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem
                          key={cls.classId}
                          value={cls.classId?.toString() || ""}
                        >
                          {cls.className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex flex-col w-1/2">
              <Label>Select Section</Label>
              <Controller
                name="sectionId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Section" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSections.map((sec) => (
                        <SelectItem
                          key={sec.sectionId}
                          value={sec.sectionId?.toString() || ""}
                        >
                          {sec.sectionName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <textarea
            className="w-full border rounded p-2 h-24"
            placeholder="Message Box for remarks"
            {...register("remarks")}
          />

          <div className="flex justify-between mt-4">
            <Button type="button" onClick={onClose} disabled={isLoading}>
              Close
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Promoting..." : "Promote"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDialog;
