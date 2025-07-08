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
import EditClass from "../classrooms/edit-class";
import { Input } from "@/components/ui/input";
import ConfirmationDialog from "../common/confirmation-dialog";
import { toast } from "sonner";
import { FeeCategoryData, useDeleteFeeCategoryMutation, useFetchFeeCategoriesQuery } from "@/services/apis/feeCategoryService";
import EditFeeCategory from "./edit-fee-category";

const FeeCategoryListTable = () => {
  const {data: feeCategories, isLoading, isError, refetch} = useFetchFeeCategoriesQuery();
  const [deleteFeeCategory] = useDeleteFeeCategoryMutation();
  const [feeCategoryToDelete, setFeeCategoryToDelete] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const feeCategoryData = feeCategories?.data as FeeCategoryData[];

  const filteredFeeCategory = feeCategoryData?.filter((cls) =>
      cls?.feeName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFeeCategory.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredFeeCategory.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  const handleDeleteConfirmation = (id: number) => {
    setFeeCategoryToDelete(id);
  };

  const handleCancelDelete = () => {
    setFeeCategoryToDelete(null);
  };

  const handleRefetch = () => {
    refetch();
  };
  
  const handleDelete = async (id: number) => {
    try {
      await deleteFeeCategory(id);
      toast.success("Fee Category deleted successfully");
      setFeeCategoryToDelete(null);
      handleRefetch();
    } catch (error) {
      toast.error("Failed to delete Fee Category");
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by Fee Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <Table className="text-left">
        <TableHeader>
          <TableRow>
            <TableHead className="h-10 p-2.5">Fee Name</TableHead>
            <TableHead className="h-10 p-2.5">Fee Description</TableHead>
            <TableHead className="h-10 p-2.5">Status</TableHead>
            <TableHead className="h-10 p-2.5 text-end">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.map((item) => (
            <TableRow
              key={item.feeCategoryId}
              className="hover:bg-default-200"
              data-state={selectedRows.includes(item.feeCategoryId!) && "selected"}
            >
              <TableCell className="p-2.5">{item.feeName}</TableCell>
              <TableCell className="p-2.5">{item.feeDescription}</TableCell>
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
                  <EditFeeCategory feeCategoryData={item} refetch={handleRefetch} />

                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() => handleDeleteConfirmation(item.feeCategoryId!)}
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
      {feeCategoryToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(feeCategoryToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default FeeCategoryListTable;
