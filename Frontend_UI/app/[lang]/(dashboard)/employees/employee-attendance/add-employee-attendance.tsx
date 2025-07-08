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
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Icon } from "@iconify/react";
import { EmployeesData } from "@/services/apis/employeeService";
import { EmployeeAttendanceData, useAddEmployeeAttendanceMutation, useFetchEmployeeAttendanceQuery } from "@/services/apis/employeeAttendanceService";
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";

interface EmployeeAttendanceProps {
  campusId?: number | null;
  employees: EmployeesData[];
  refetch: () => void;
}

const employeeAttendanceSchema = z.object({});

type EmployeeAttendanceFormValues = z.infer<typeof employeeAttendanceSchema>;

const AddEmployeeAttendance: React.FC<EmployeeAttendanceProps> = ({
  employees,
  campusId,
  refetch,
}) => {
  const { handleSubmit, reset } = useForm<EmployeeAttendanceFormValues>({
    resolver: zodResolver(employeeAttendanceSchema),
    defaultValues: {
      campusId: campusId || 0,
     },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 
  const totalPages = Math.ceil(employees?.length / itemsPerPage);

  const [attendance, setAttendance] = useState<Record<number, string>>({});
  const [existingAttendance, setExistingAttendance] = useState<Record<number, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [addAttendance] = useAddEmployeeAttendanceMutation();
  const { data: fetchedAttendance } = useFetchEmployeeAttendanceQuery();
  const loggedUser = useSelector((state: RootState) => state.auth.user);

  // Populate existing attendance on load
  useEffect(() => {
    if (fetchedAttendance?.data && Array.isArray(fetchedAttendance.data)) {
      const currentDate = new Date().toISOString().slice(0, 10); // Format date as YYYY-MM-DD
      const existing = fetchedAttendance.data.reduce<Record<number, boolean>>(
        (acc, entry) => {
          if (entry.attendanceDate === currentDate) {
            acc[entry.employeeId || 0] = true; // Mark student as having attendance for the current date
          }
          return acc;
        },
        {}
      );
      setExistingAttendance(existing);
    }
  }, [fetchedAttendance]);

  const handleAttendanceChange = (employeeId: number, isChecked: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [employeeId]: isChecked ? "Present" : "Absent",
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    


    const attendanceEntries = employees
      .filter((employee) => !existingAttendance[employee?.employeeId || 0])
      .map((employee) => ({
        employeeId: employee.employeeId,
        attendanceStatus: attendance[employee?.employeeId || 0] || "Absent",
        attendanceDate: formattedDate,
        createdBy: loggedUser?.userId,
      }));

    if (attendanceEntries.length === 0) {
      toast.error("Attendance for these Employee has already been recorded.");
      return;
    }

    try {
      const response = await addAttendance(attendanceEntries);
      if (response?.data?.success) {
        toast.success("employee Attendance Saved successfully!");
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

  const currentEmployee = employees?.slice(
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
          Add Employee Attendance
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add Employee Attendance</SheetTitle>
        </SheetHeader>
        <div>
          <form onSubmit={onSubmit}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.No</TableHead>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentEmployee?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                    <TableCell>
                      {item.firstName} {item.lastName}
                    </TableCell>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={attendance[item.employeeId || 0] === "Present"}
                        disabled={!!existingAttendance[item.employeeId || 0]}
                        onChange={(e) =>
                          handleAttendanceChange(item?.employeeId || 0, e.target.checked)
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
              {isSaving ? "Saving..." : "Save Attendance"}
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddEmployeeAttendance;
