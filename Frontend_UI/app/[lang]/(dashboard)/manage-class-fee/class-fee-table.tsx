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
import { Input } from "@/components/ui/input";
import ConfirmationDialog from "../common/confirmation-dialog";

import { toast } from "sonner";
import {
  ClassFeeData,
  useDeleteClassFeeMutation,
  useFetchClassFeeQuery,
} from "@/services/apis/manageClassFeeService";
import EditClassFee from "./edit-class-fee";
import { CampusData } from "@/services/apis/campusService";
import { ClassData } from "@/services/apis/classService";
import { FeeCategoryData } from "@/services/apis/feeCategoryService";

interface ClassFeeListTableProps {
  refetch: () => void;
  campuses: CampusData[];
  classes?: ClassData[];
  feeCategory?: FeeCategoryData[];
}
const ClassFeeListTable: React.FC<ClassFeeListTableProps> = ({
  refetch,
  classes,
  campuses,
  feeCategory,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [classFeeToDelete, setClassFeeToDelete] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const { data, isLoading, refetch: classFeeRefetch } = useFetchClassFeeQuery();
  const classFeesData = data?.data as ClassFeeData[];
  const [deleteClassFee] = useDeleteClassFeeMutation();

  const handleRefetch = () => {
    refetch();
    classFeeRefetch();
  };

  const filteredClassFees = classFeesData?.filter(
    (fee) =>
      fee?.className?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fee?.campusName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fee?.feeName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClassFees?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredClassFees?.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDeleteConfirmation = (id: number) => {
    setClassFeeToDelete(id);
  };

  const handleCancelDelete = () => {
    setClassFeeToDelete(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteClassFee(id);
      toast.success("Class Fee deleted successfully");
      setClassFeeToDelete(null); // Close dialog after successful deletion
      handleRefetch();
    } catch (error) {
      console.error("Error deleting Class Fee:", error);
      toast.error("Failed to delete Class Fee");
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by class name, campus, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <Table className="text-left">
        <TableHeader>
          <TableRow>
            <TableHead className="h-10 p-2.5">Campus Name</TableHead>
            <TableHead className="h-10 p-2.5">Class Name</TableHead>
            <TableHead className="h-10 p-2.5">Fee Category</TableHead>
            <TableHead className="h-10 p-2.5">Amount</TableHead>
            <TableHead className="h-10 p-2.5">Created At</TableHead>
            <TableHead className="h-10 p-2.5 text-end">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems?.map((item) => (
            <TableRow key={item.classFeeId} className="hover:bg-default-200">
              <TableCell className="p-2.5">{item.campusName}</TableCell>
              <TableCell className="p-2.5">{item.className}</TableCell>
              <TableCell className="p-2.5">
                <Badge variant="outline" className="capitalize">
                  {item.feeName}
                </Badge>
              </TableCell>
              <TableCell className="p-2.5">${item.amount}</TableCell>
              <TableCell className="p-2.5">
                {item?.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : "N/A"}
              </TableCell>

              <TableCell className="p-2.5 flex justify-end">
                <div className="flex gap-3">
                  <EditClassFee
                    classFeeData={item}
                    campuses={campuses}
                    classes={classes}
                    feeCategory={feeCategory}
                    refetch={handleRefetch}
                  />

                  <Button
                    size="icon"
                    variant="outline"
                    color="destructive"
                    className="h-7 w-7"
                    onClick={() => handleDeleteConfirmation(item.classFeeId!)}
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

      {classFeeToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(classFeeToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default ClassFeeListTable;
