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
import { toast } from "sonner";
import {
  DailyExpenseData,
  useDeleteDailyExpenseMutation,
} from "@/services/apis/dailyExpenseService";
import EditDailyExpense from "./edit-expense";
import { ExpenseCategoryData } from "@/services/apis/expenseCategoryService";

interface Props {
  expenses: DailyExpenseData[];
  refetch: () => void;
  categories: ExpenseCategoryData[];
}

const ExpenseTable: React.FC<Props> = ({ expenses, refetch, categories }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null);
  const itemsPerPage = 50;

  const [deleteExpense] = useDeleteDailyExpenseMutation();

  const filtered = expenses?.filter(
    (exp) =>
      exp.item?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered?.length / itemsPerPage);

  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleDelete = async (id: number) => {
    try {
      await deleteExpense(id).unwrap();
      toast.success("Expense deleted successfully");
      setExpenseToDelete(null);
      refetch();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  const handleDeleteConfirmation = (id: number) => {
    setExpenseToDelete(id);
  };

  const handleCancelDelete = () => {
    setExpenseToDelete(null);
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by item or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <Table className="text-left">
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>TotalAmount</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableRow>
              <TableHead className="text-left align-top pl-10 pt-5">Action</TableHead>
            </TableRow>{" "}
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems?.map((item) => (
            <TableRow key={item.dailyExpenseId} className="hover:bg-muted/40">
              <TableCell>{item.item}</TableCell>
              <TableCell>{item.categoryName}</TableCell>
              <TableCell>{item.totalAmount}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.amount}</TableCell>
              <TableCell>{item.amountDate}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {item.amountType}
                </Badge>
              </TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>
                <div className="flex justify-center items-center gap-2">
                  <EditDailyExpense
                    expenseData={item}
                    refetch={refetch}
                    categories={categories}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-100"
                    onClick={() =>
                      handleDeleteConfirmation(item.dailyExpenseId!)
                    }
                  >
                    <Icon icon="heroicons:trash" className="h-5 w-5" />
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

      {/* Confirmation Dialog */}
      {expenseToDelete !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this expense?</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white"
                onClick={() => handleDelete(expenseToDelete)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExpenseTable;
