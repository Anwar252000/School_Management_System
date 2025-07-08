"use client";

import React, { useState } from "react";
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
import EditDepartment from "./edit-department";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ConfirmationDialog from "../common/confirmation-dialog";
import { CampusData } from "@/services/apis/campusService";
import { DepartmentData, useDeleteDepartmentMutation } from "@/services/apis/departmentService";

interface DepartmentProps {
  campus: CampusData;
  refetch: () => void;
}

const SelectionOperation = ({ campus, refetch }: DepartmentProps) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [departmentToDelete, setDepartmentToDelete] = useState<number | null>(null);
  const [deleteDepartment] = useDeleteDepartmentMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredDepartments =
    campus?.departments?.filter((dept) =>
      dept.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const currentItems = filteredDepartments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDeleteConfirmation = (id: number) => {
    setDepartmentToDelete(id);
  };

  const handleCancelDelete = () => {
    setDepartmentToDelete(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDepartment(id);
      toast.success("Department deleted successfully");
      refetch();
      setDepartmentToDelete(null); // Close dialog after successful deletion
    } catch (error) {
      console.error("Error deleting Department:", error);
      toast.error("Failed to delete Department");
    }
  };


  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by department name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <Table className="text-left">
        <TableHeader>
          <TableRow>
            <TableHead className="h-10 p-2.5">Department</TableHead>
            <TableHead className="h-10 p-2.5">Description</TableHead>
            <TableHead className="h-10 p-2.5">Status</TableHead>
            <TableHead className="h-10 p-2.5 text-end">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.map((item: DepartmentData) => (
            <TableRow
              key={item.departmentId}
              className="hover:bg-default-200"
              data-state={selectedRows.includes(item.departmentId!) && "selected"}
            >
              <TableCell className="p-2.5">{item.departmentName}</TableCell>
              <TableCell className="p-2.5">{item.description}</TableCell>
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
                  <EditDepartment department={item} campus={campus} refetch={refetch} />
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() => handleDeleteConfirmation(item.departmentId!)}
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
      {departmentToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(departmentToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default SelectionOperation;
