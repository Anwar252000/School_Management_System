"use client";

import React, { useState, useEffect } from "react";
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
import EditClassSubjectAssign from "./edit-classsubjectassignment";
import { toast } from "sonner";
import ConfirmationDialog from "../common/confirmation-dialog";
import { ClassData } from "@/services/apis/classService";
import { SubjectData } from "@/services/apis/subjectService";
import { AssignClassSubjectData, useDeleteClassSubjectMutation, useFetchClassSubjectQuery } from "@/services/apis/assignClassSubjectService";

interface SubjectAssignmentProps {
  classes: ClassData[];
  subject: SubjectData[];
  refetch: () => void
}

const SubjectAssignTable = ({ classes, subject, refetch }: SubjectAssignmentProps) => {
  const {data: classSubject, isLoading, isError} = useFetchClassSubjectQuery();
  const subjectAssignments = classSubject?.data as AssignClassSubjectData[];
  const [deleteClassSubjectAssignment] = useDeleteClassSubjectMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [classSubjectToDelete, setClassSubjectToDelete] = useState<
    number | null
  >(null);
  const itemsPerPage = 10;

  // Group subjects by classId
  const groupedAssignments = subjectAssignments?.reduce((acc, assignment) => {
    const associatedClass = classes?.find(
      (cls) => cls.classId === assignment.classId
    );
    const associatedSubjects = subject?.filter((sub) =>
      assignment.subjectIds?.includes(sub.subjectId ?? 0)
    );

    if (associatedClass) {
      if (!acc[assignment.classId ?? 0]) {
        acc[assignment.classId ?? 0] = {
          classSubjectId: assignment?.classSubjectId,
          classId: assignment?.classId,
          className: associatedClass?.className ?? "",
          subjects: [],
          isActive: assignment.isActive ?? false,
        };
      }
      if (acc[assignment.classId ?? 0] && Array.isArray(acc[assignment.classId ?? 0].subjects) && associatedSubjects?.length) {
        acc[assignment.classId ?? 0].subjects.push(
          ...associatedSubjects.map((sub) => sub.subjectName)
        );
      }
      
      
    }
    return acc;
  }, {} as Record<number, { classSubjectId?: number; classId?: number; className: string; subjects: string[]; isActive?: boolean }>);

  const combinedData = groupedAssignments ? Object.values(groupedAssignments) : [];

  const filteredAssignments = combinedData?.filter((item) =>
    item.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssignments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDeleteConfirmation = (id: number) => {
    setClassSubjectToDelete(id);
  };

  const handleCancelDelete = () => {
    setClassSubjectToDelete(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteClassSubjectAssignment(id);
      toast.success("ClassSubject deleted successfully");
      refetch();
      setClassSubjectToDelete(null);
    } catch (error) {
      console.error("Error deleting ClassSubject:", error);
      toast.error("Failed to delete ClassSubject");
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center mt-5">
        <Input
          type="text"
          placeholder="Search by Class Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <Table className="text-left condensed">
        <TableHeader>
          <TableRow>
            <TableHead className="h-10 p-2.5">Class Name</TableHead>
            <TableHead className="h-10 p-2.5">Subjects</TableHead>
            <TableHead className="h-10 p-2.5">Status</TableHead>
            <TableHead className="h-10 p-2.5 text-end">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.map((item) => (
            <TableRow
              key={item.classSubjectId}
              className="hover:bg-default-200"
              data-state={
                selectedRows.includes(item.classSubjectId!) && "selected"
              }
            >
              <TableCell className="p-2.5">{item.className}</TableCell>
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
                  <EditClassSubjectAssign
                    subject={subject}
                    classes={classes}
                    subjectAssignmentData={[item]}
                    refetch={refetch}
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() => handleDeleteConfirmation(item.classId!)}
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
        <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
      {classSubjectToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(classSubjectToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default SubjectAssignTable;
