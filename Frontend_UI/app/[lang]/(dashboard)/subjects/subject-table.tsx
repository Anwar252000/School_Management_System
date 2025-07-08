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
import EditClass from "../classrooms/edit-class";
import { Input } from "@/components/ui/input";
import EditSubject from "./edit-subject";
import { toast } from "sonner";
import ConfirmationDialog from "../common/confirmation-dialog";
import { SubjectData, useDeleteSubjectMutation } from "@/services/apis/subjectService";

const SubjectListTable = (
  {
    subject,
    refetch
  }:{
    subject: SubjectData[];
    refetch: () => void;
  }) => {
  const [deleteSubject] = useDeleteSubjectMutation();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectToDelete, setSubjectToDelete] = useState<number | null>(null);
  const itemsPerPage = 10;

  const filteredSubjects = subject.filter((sub) =>
    sub.subjectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubjects.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);

   const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDeleteConfirmation = (id: number) => {
    setSubjectToDelete(id);
  };

  const handleCancelDelete = () => {
    setSubjectToDelete(null);
  };

  const handleRefetch = () => {
    refetch();
  }
  const handleDelete = async (id: number) => {
    try {
      await deleteSubject(id);
      toast.success("Subject deleted successfully");
      handleRefetch();
      setSubjectToDelete(null); // Close dialog after successful deletion
    } catch (error) {
      console.error("Error deleting Subject:", error);
      toast.error("Failed to delete Subject");
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by class name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <Table className="text-left">
        <TableHeader>
          <TableRow>
            <TableHead className="h-10 p-2.5">Subject Name</TableHead>
            <TableHead className="h-10 p-2.5">Description</TableHead>
            <TableHead className="h-10 p-2.5">Status</TableHead>
            <TableHead className="h-10 p-2.5 text-end">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.map((item) => (
            <TableRow
              key={item.subjectId}
              className="hover:bg-default-200"
              data-state={selectedRows.includes(item.subjectId!) && "selected"}
            >
              <TableCell className="p-2.5">{item.subjectName}</TableCell>
              <TableCell className="p-2.5">{item.subjectDescription}</TableCell>
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
                  <EditSubject subject={item} refetch={handleRefetch}/>

                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() => handleDeleteConfirmation(item.subjectId!)}
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
      {subjectToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(subjectToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default SubjectListTable;
