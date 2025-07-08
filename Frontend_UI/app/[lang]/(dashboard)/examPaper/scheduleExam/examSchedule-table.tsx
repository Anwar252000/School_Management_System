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
import { toast } from "sonner";
import ConfirmationDialog from "../../common/confirmation-dialog";
import EditExamSchedule from "./edit-schedule";
import { ExamData, useDeleteExamMutation } from "@/services/apis/examService";

interface DataProps{
  examSchedule: ExamData[];
  refetch: () => void;
}

const ExamScheduleTable: React.FC<DataProps> = ({examSchedule, refetch}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [examToDelete, setExamToDelete] = useState<number | null>(null);
  const itemsPerPage = 10;
  const [deleteExam] = useDeleteExamMutation();
  
  const filteredExams = examSchedule?.filter((cls) =>
      cls.className?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExams?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredExams?.length / itemsPerPage);

  

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleCancelDelete = () => {
    setExamToDelete(null);
  };

  const handleDeleteConfirmation = (id: number) => {
    setExamToDelete(id);
  };
  
  
  const handleDelete = async (id: number) => {
    try {
      await deleteExam(id);
      toast.success("ExamSchedule deleted successfully");
      refetch();
      setExamToDelete(null);
    } catch (error) {
      console.error("Error deleting ExamSchedule:", error);
      toast.error("Failed to delete ExamSchedule");
    }
  };
   

  return (
    <>
      <div className="mb-4 flex justify-between items-center mt-5">
        <Input
          type="text"
          placeholder="Search by Class/Subject Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <Table className="text-left condensed">
        <TableHeader>
          <TableRow>
          <TableHead className="h-10 p-2.5">S.No</TableHead>
            <TableHead className="h-10 p-2.5">Campus Name</TableHead>
            <TableHead className="h-10 p-2.5">Subject Name</TableHead>
            <TableHead className="h-10 p-2.5">Class Name</TableHead>
            <TableHead className="h-10 p-2.5">Term Name</TableHead>
            <TableHead className="h-10 p-2.5">Exam Date</TableHead>
            <TableHead className="h-10 p-2.5">Start Time</TableHead>
            <TableHead className="h-10 p-2.5">End Time</TableHead>
            <TableHead className="h-10 p-2.5">Status</TableHead>
            <TableHead className="h-10 p-2.5">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems?.map((item, index) => (
            <TableRow
              key={item.examId}
              className="hover:bg-default-200"
              data-state={
                selectedRows.includes(item.examId!) && "selected"
              }
            >
              <TableCell className="p-2.5">{index + 1}</TableCell>
              <TableCell className="p-2.5">{item.campusName}</TableCell>
              <TableCell className="p-2.5">{item.subjectName}</TableCell>
              <TableCell className="p-2.5">{item.className}</TableCell>
              <TableCell className="p-2.5">{item.termName}</TableCell>
              <TableCell className="p-2.5 ">{item.examDate}</TableCell>
              <TableCell className="p-2.5">{item.startTime}</TableCell>
              <TableCell className="p-2.5">{item.endTime}</TableCell>
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
                  <EditExamSchedule examItem={[item]} refetch={refetch} />
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() => handleDeleteConfirmation(item.examId!)}
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
      {examToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(examToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default ExamScheduleTable;
