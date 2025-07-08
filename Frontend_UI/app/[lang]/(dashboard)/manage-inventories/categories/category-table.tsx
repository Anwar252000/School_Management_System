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
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

import EditCategory from "./edit-category";
import ConfirmationDialog from "../../common/confirmation-dialog";
import {
  InventoryCategoryData,
  useDeleteInventoryCategoryMutation,
} from "@/services/apis/inventoryCategoryService";

interface CategoryListTableProps {
  categories: InventoryCategoryData[];
}

const CategoryListTable: React.FC<CategoryListTableProps> = ({
  categories,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const itemsPerPage = 8;

  const [deleteCategory] = useDeleteInventoryCategoryMutation();

  // Apply search filter and pagination
  const filteredCategories = (categories ?? []).filter(
    (category) =>
      category?.categoryName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      category?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredCategories?.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDeleteConfirmation = (id: number) => {
    setCategoryToDelete(id);
  };

  const handleCancelDelete = () => {
    setCategoryToDelete(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully");
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting Category:", error);
      toast.error("Failed to delete Category");
    }
  };

  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by Category Name or Description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded m-2"
        />
      </div>
      <Table className="text-left">
        <TableHeader>
          <TableRow>
            <TableHead className="h-10 p-2.5">Category Code</TableHead>
            <TableHead className="h-10 p-2.5">Category Name</TableHead>
            <TableHead className="h-10 p-2.5">Description</TableHead>
            <TableHead className="h-10 p-2.5">Created Date</TableHead>
            <TableHead className="h-10 p-2.5">Status</TableHead>
            <TableHead className="h-10 p-2.5 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.map((item) => (
            <TableRow
              key={item.categoryId}
              className="hover:bg-default-200"
              // data-state={selectedRows.includes(item.categoryId!) && "selected"}
            >
              <TableCell className="p-2.5">
                {item.categoryName.substring(0, 2).toUpperCase()}
              </TableCell>

              <TableCell className="p-2.5">{item.categoryName}</TableCell>
              <TableCell className="p-2.5"> {item.description}</TableCell>
              <TableCell className="p-2.5">
                {item?.createdAt
                  ? formatDate(item.createdAt)
                  : "No Created Date"}
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
              <TableCell className="p-2.5 flex justify-center">
                <div className="flex gap-3">
                  <EditCategory categoryData={item} />
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() => handleDeleteConfirmation(item.categoryId!)}
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
      {categoryToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(categoryToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default CategoryListTable;
