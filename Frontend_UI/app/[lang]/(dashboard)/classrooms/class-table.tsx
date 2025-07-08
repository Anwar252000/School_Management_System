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
import ConfirmationDialog from "../common/confirmation-dialog";
import { toast } from "sonner";
import { ClassData, useDeleteClassMutation, useFetchClassQuery } from "@/services/apis/classService";

const ClassListTable = () => {
  const {data: classes, isLoading, isError, refetch} = useFetchClassQuery();
  const [deleteClass] = useDeleteClassMutation();
  const [classToDelete, setClassToDelete] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const classData = classes?.data as ClassData[];

  const filteredClass = classData?.filter((cls) =>
      cls?.className?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClass.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredClass.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  const handleDeleteConfirmation = (id: number) => {
    setClassToDelete(id);
  };

  const handleCancelDelete = () => {
    setClassToDelete(null);
  };

  const handleRefetch = () => {
    refetch();
  };
  
  const handleDelete = async (id: number) => {
    try {
      await deleteClass(id);
      toast.success("Class deleted successfully");
      setClassToDelete(null);
      handleRefetch();
    } catch (error) {
      console.error("Error deleting Class:", error);
      toast.error("Failed to delete Class");
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
            <TableHead className="h-10 p-2.5">Class Name</TableHead>
            <TableHead className="h-10 p-2.5">Description</TableHead>
            <TableHead className="h-10 p-2.5">Capacity</TableHead>
            <TableHead className="h-10 p-2.5">Status</TableHead>
            <TableHead className="h-10 p-2.5 text-end">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.map((item) => (
            <TableRow
              key={item.classId}
              className="hover:bg-default-200"
              data-state={selectedRows.includes(item.classId!) && "selected"}
            >
              <TableCell className="p-2.5">{item.className}</TableCell>
              <TableCell className="p-2.5">{item.classDescription}</TableCell>
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
                  <EditClass classData={item} refetch={handleRefetch} />

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
      {classToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(classToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default ClassListTable;
