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
import EditClassSectionAssign from "./edit-classsectionassignment";
import { toast } from "sonner";
import ConfirmationDialog from "../common/confirmation-dialog";
import { ClassData } from "@/services/apis/classService";
import { ClassroomData } from "@/services/apis/classroomService";
import { SectionData } from "@/services/apis/sectionService";
import { ClassAssignData, useDeleteClassAssignmentMutation, useFetchClassAssignmentsQuery } from "@/services/apis/assignClassService";
import { CampusData } from "@/services/apis/campusService";

interface ClassAssignmentProps {
  classes: ClassData[];
  classroom: ClassroomData[];
  section: SectionData[];
  campus: CampusData[];
}

const ClassAssignTable = ({
  classes,
  classroom,
  section,
  campus,
}: ClassAssignmentProps) => {
  const [classAssignmentToDelete, setClassAssignmentToDelete] = useState< number | null >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {data: classassignment, isLoading, isError, refetch} = useFetchClassAssignmentsQuery();
  const [deleteClassAssignment] = useDeleteClassAssignmentMutation();
  const classAssignmentData = classassignment?.data as ClassAssignData[];

  const combinedData = classAssignmentData?.map((assignment) => {
    const associatedClass = classes.find(
      (cls) => cls.classId === assignment.classId
    );
    const associatedSection = section.find(
      (sec) => sec.sectionId === assignment.sectionId
    );
    const associatedClassroom = classroom.find(
      (classroom) => classroom.classroomId === assignment.classroomId
    );
    const associatedCampusId = campus.find(
      (campus) => campus.campusId === assignment.campusId
    );

    return {
      assignmentId: assignment.assignmentId,
      className: associatedClass?.className || "",
      sectionName: associatedSection?.sectionName || "",
      roomNumber: associatedClassroom?.roomNumber || "",
      campusName: associatedCampusId?.campusName || "",
      isActive: assignment.isActive,
      classId: assignment.classId,
      classroomId: assignment.classroomId,
      sectionId: assignment.sectionId,
      campusId: assignment.campusId,
    };
  });

  const sortedData = combinedData?.sort((a, b) => {
    if (a.roomNumber < b.roomNumber) return -1;
    if (a.roomNumber > b.roomNumber) return 1;

    return 0;
  });

  const filteredClassassignments = sortedData?.filter(
    (item) =>
      item.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sectionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClassassignments?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredClassassignments?.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDeleteConfirmation = (id: number) => {
    setClassAssignmentToDelete(id);
  };

  const handleCancelDelete = () => {
    setClassAssignmentToDelete(null);
  };

  const handleRefetch = () => {
    refetch();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteClassAssignment(id);
      toast.success("Class Assignment deleted successfully");
      handleRefetch();
      setClassAssignmentToDelete(null);
    } catch (error) {
      console.error("Error deleting class assignment:", error);
      toast.error("Failed to delete class assignment");
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center mt-5">
        <Input
          type="text"
          placeholder="Search by Room Number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <Table className="text-left condensed">
        <TableHeader>
          <TableRow>
            <TableHead className="h-10 p-2.5">Campus Name</TableHead>
            <TableHead className="h-10 p-2.5">Classroom Number</TableHead>
            <TableHead className="h-10 p-2.5">Class Name</TableHead>
            <TableHead className="h-10 p-2.5">Section Name</TableHead>
            <TableHead className="h-10 p-2.5">Status</TableHead>
            <TableHead className="h-10 p-2.5 text-end">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems?.map((item) => (
            <TableRow
              key={item.assignmentId}
              className="hover:bg-default-200"
              data-state={
                selectedRows.includes(item.assignmentId!) && "selected"
              }
            >
              <TableCell className="p-2.5">{item.campusName}</TableCell>
              <TableCell className="p-2.5">{item.roomNumber}</TableCell>
              <TableCell className="p-2.5">{item.className}</TableCell>
              <TableCell className="p-2.5">{item.sectionName}</TableCell>
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
                  <EditClassSectionAssign assignmentData={[item]} 
                  refetch={handleRefetch}
                  classData={classes}
                  classroomData={classroom}
                  sectionData={section}
                  // campusData={campus}
                  />

                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() => handleDeleteConfirmation(item.assignmentId!)}
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
      {classAssignmentToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(classAssignmentToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default ClassAssignTable;
