"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import EditSubjectTeacher from "./edit-subject-teacher";
import { toast } from "sonner";
import ConfirmationDialog from "../common/confirmation-dialog";
import {
  SubjectTeacherData,
  useDeleteSubjectTeacherMutation,
} from "@/services/apis/assignSubjectTeacherService";
import { SubjectData } from "@/services/apis/subjectService";
import { EmployeesData } from "@/services/apis/employeeService";

interface SubjectTeacherProps {
  employee: EmployeesData[];
  subjectTeacher: SubjectTeacherData[];
  subject: SubjectData[];
  refetch: () => void;
}

const itemsPerPage = 8;

const SubjectTeacherTable = ({
  refetch,
  subject,
  employee,
  subjectTeacher,
}: SubjectTeacherProps) => {
  const [deleteSubjectTeacher] = useDeleteSubjectTeacherMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [subjectTeacherToDelete, setSubjectTeacherToDelete] = useState<
    number | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);

  const groupedAssignments = subjectTeacher?.reduce((acc, assignment) => {
    const associatedEmployee = employee?.find(
      (cls) => cls?.employeeId === assignment?.employeeId
    );
    const associatedSubjects = subject?.filter((sub) =>
      assignment.subjectIds?.includes(sub.subjectId ?? 0)
    );

    if (associatedEmployee) {
      if (!acc[assignment.employeeId]) {
        acc[assignment.employeeId] = {
          subjectTeacherId: assignment.subjectTeacherId,
          employeeId: assignment.employeeId,
          employeeName: assignment.employeeName,
          subjects: [],
          subjectIds: assignment.subjectIds ?? [],
          isActive: assignment.isActive ?? false,
        };
      }
      acc[assignment.employeeId].subjects.push(
        ...associatedSubjects?.map((sub) => sub?.subjectName)
      );
    }
    return acc;
  }, {} as Record<number, { subjectTeacherId?: number; employeeId: number; subjectIds: number[]; employeeName?: string; subjects: string[]; isActive?: boolean }>);

  const combinedData = Object.values(groupedAssignments);
  const filtered = combinedData.filter((item) =>
    item.employeeName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handlePageChange = (direction: "previous" | "next") => {
    setCurrentPage((prev) =>
      direction === "previous"
        ? Math.max(prev - 1, 1)
        : Math.min(prev + 1, totalPages)
    );
  };

  const handleDeleteConfirmation = (id: number) =>
    setSubjectTeacherToDelete(id);
  const handleCancelDelete = () => setSubjectTeacherToDelete(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteSubjectTeacher(id);
      toast.success("Subject Teacher deleted successfully");
      refetch();
      setSubjectTeacherToDelete(null);
    } catch (error) {
      console.error("Error deleting Subject Teacher:", error);
      toast.error("Failed to delete Subject Teacher");
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center mt-5">
        <Input
          type="text"
          placeholder="Search By Subject Or Teacher Name...."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <Table className="text-left condensed">
        <TableHeader>
          <TableRow>
            <TableHead className="h-10 p-2.5">Teacher Name</TableHead>
            <TableHead className="h-10 p-2.5">Subject Name</TableHead>
            <TableHead className="h-10 p-2.5">Status</TableHead>
            <TableHead className="h-10 p-2.5 text-end">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((item) => (
            <TableRow
              key={item.subjectTeacherId}
              className="hover:bg-default-200"
              data-state={
                selectedRows.includes(item.subjectTeacherId!)
                  ? "selected"
                  : undefined
              }
            >
              <TableCell className="p-2.5">{item.employeeName}</TableCell>
              <TableCell className="p-2.5">
                {item.subjects.join(" | ")}
              </TableCell>
              <TableCell className="p-2.5">
                <Badge
                  variant="outline"
                  color={item.isActive ? "success" : "destructive"}
                  className="capitalize"
                >
                  {item.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="p-2.5 flex justify-end">
                <div className="flex gap-3">
                  <EditSubjectTeacher
                    subjectTeacherData={item}
                    subjectData={subject}
                    refetch={refetch}
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() => handleDeleteConfirmation(item.employeeId!)}
                  >
                    <Icon icon="heroicons:trash" className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => handlePageChange("previous")}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange("next")}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
      {subjectTeacherToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(subjectTeacherToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default SubjectTeacherTable;
