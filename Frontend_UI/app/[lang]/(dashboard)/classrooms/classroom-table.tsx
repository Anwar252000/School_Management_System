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
import EditClassroom from "./edit-classroom";
import ConfirmationDialog from "../common/confirmation-dialog";
import { toast } from "sonner";
import {
  ClassroomData,
  useDeleteClassroomMutation,
  useFetchClassroomsQuery,
} from "@/services/apis/classroomService";

const ClassroomListTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [classroomToDelete, setClassroomToDelete] = useState<number | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, refetch } = useFetchClassroomsQuery();
  const classroomsData = data?.data as ClassroomData[];
  const [deleteClassroom] = useDeleteClassroomMutation();

  const handleRefetch = () => {
    refetch();
  };

  const filteredClassrooms = classroomsData?.filter((classroom) =>
    classroom.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClassrooms?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredClassrooms?.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  const handleDeleteConfirmation = (id: number) => {
    setClassroomToDelete(id);
  };

  const handleCancelDelete = () => {
    setClassroomToDelete(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteClassroom(id);
      toast.success("Classroom deleted successfully");
      setClassroomToDelete(null); // Close dialog after successful deletion
      handleRefetch();
    } catch (error) {
      console.error("Error deleting Classroom:", error);
      toast.error("Failed to delete Classroom");
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by Room Number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <Table className="text-left">
        <TableHeader>
          <TableRow>
            <TableHead className="h-10 p-2.5">Room Number</TableHead>
            <TableHead className="h-10 p-2.5">Building</TableHead>
            <TableHead className="h-10 p-2.5">Capacity</TableHead>
            <TableHead className="h-10 p-2.5">Status</TableHead>
            <TableHead className="h-10 p-2.5 text-end">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems?.map((item) => (
            <TableRow
              key={item.classroomId}
              className="hover:bg-default-200"
              data-state={
                selectedRows.includes(item.classroomId!) && "selected"
              }
            >
              <TableCell className="p-2.5">{item.roomNumber}</TableCell>
              <TableCell className="p-2.5">{item.building}</TableCell>
              <TableCell className="p-2.5">{item.capacity}</TableCell>
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
                  <EditClassroom classroomData={item} refetch={handleRefetch} />

                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() => handleDeleteConfirmation(item.classroomId!)}
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
      {classroomToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(classroomToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default ClassroomListTable;
