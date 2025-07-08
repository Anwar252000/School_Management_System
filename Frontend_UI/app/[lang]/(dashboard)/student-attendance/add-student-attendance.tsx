"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StudentData } from "@/services/apis/studentService";
import {
  useAddStudentAttendanceMutation,
  useFetchStudentAttendanceQuery,
} from "@/services/apis/studentAttendanceService";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";

interface StudentAttendanceProps {
  classId?: number | null;
  sectionId?: number | null;
  campusId?: number | null;
  students: StudentData[];
  refetch: () => void;
}

const studentAttendanceSchema = z.object({});

type StudentAttendanceFormValues = z.infer<typeof studentAttendanceSchema>;

const AddStudentAttendance: React.FC<StudentAttendanceProps> = ({
  classId,
  sectionId,
  campusId,
  students,
  refetch,
}) => {
  const { handleSubmit, reset } = useForm<StudentAttendanceFormValues>({
    resolver: zodResolver(studentAttendanceSchema),
    defaultValues: {
      campusId: campusId || 0,
      classId: classId || 0,
      sectionId: sectionId || 0,
    },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set 10 items per page
  const totalPages = Math.ceil(students?.length / itemsPerPage);

  const [attendance, setAttendance] = useState<Record<number, string>>({});
  const [existingAttendance, setExistingAttendance] = useState<Record<number, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [addAttendance] = useAddStudentAttendanceMutation();
  const { data: fetchedAttendance } = useFetchStudentAttendanceQuery();
  const loggedUser = useSelector((state: RootState) => state.auth.user);

  // Populate existing attendance on load
  useEffect(() => {
    if (fetchedAttendance?.data && Array.isArray(fetchedAttendance.data)) {
      const currentDate = new Date().toISOString().slice(0, 10); // Format date as YYYY-MM-DD
      const existing = fetchedAttendance.data.reduce<Record<number, boolean>>(
        (acc, entry) => {
          if (entry.attendanceDate === currentDate) {
            acc[entry.studentId || 0] = true; // Mark student as having attendance for the current date
          }
          return acc;
        },
        {}
      );
      setExistingAttendance(existing);
    }
  }, [fetchedAttendance]);

  const handleAttendanceChange = (studentId: number, isChecked: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: isChecked ? "Present" : "Absent",
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentDate = new Date();
    const formattedDate = currentDate?.toISOString().slice(0, 10);

    const attendanceEntries = students
      .filter((student) => !existingAttendance[student.studentId])
      .map((student) => ({
        studentId: student.studentId,
        attendanceStatus: attendance[student.studentId] || "Absent",
        attendanceDate: formattedDate,
        classId: classId || 0,
        sectionId: sectionId || 0,
        createdBy: loggedUser?.userId,
      }));

    if (attendanceEntries.length === 0) {
      toast.error("Attendance for these students has already been recorded.");
      return;
    }

    try {
      const response = await addAttendance(attendanceEntries);
      if (response?.data?.success) {
        toast.success("Attendance Saved successfully!");
        reset();
        refetch();
      } else {
        toast.error(response?.data?.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Failed to save attendance.");
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const currentStudents = students?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <span className="text-xl mr-1">
            <Icon icon="heroicons:building-library-solid" className="w-6 h-6 mr-2" />
          </span>
          Add Student Attendance
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add Student Attendance</SheetTitle>
        </SheetHeader>
        <div>
          <form onSubmit={onSubmit}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.No</TableHead>
                  <TableHead>GR No</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentStudents?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                    <TableCell>{item.grNo}</TableCell>
                    <TableCell>
                      {item.firstName} {item.lastName}
                    </TableCell>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={attendance[item.studentId] === "Present"}
                        disabled={!!existingAttendance[item.studentId]}
                        onChange={(e) =>
                          handleAttendanceChange(item.studentId, e.target.checked)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-between mt-4">
              <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous
              </Button>
              <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
              </Button>
            </div>
            <div className="flex justify-end mt-4">
              <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Submit Attendance"}
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddStudentAttendance;
