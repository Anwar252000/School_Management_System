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
import { format } from "date-fns";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import ConfirmationDialog from "../common/confirmation-dialog";

import EditTransaction from "./edit-transaction";
import {
  TransactionData,
  useDeleteTransactionMutation,
} from "@/services/apis/transactionService";
import TransactionDetailsDialog from "./transaction-details-dialog";

interface TransactionListTableProps {
  transaction: TransactionData[];
}

const TransactionListTable: React.FC<TransactionListTableProps> = ({
  transaction,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [openViewModal, setOpenViewModal] = useState<Boolean>(false);
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const [TransactionToDelete, setTransactionToDelete] = useState<number | null>(
    null
  );
  const itemsPerPage = 50;
  // const [detailedTransaction, setDetailedTransaction] = useState<TransactionData | null>(null);
  const [deleteTransaction] = useDeleteTransactionMutation();

  const filteredTransactions = (transaction as TransactionData[])?.filter(
    (transaction) =>
      transaction?.payee?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction?.messer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction?.voucherType
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction?.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction?.voucherNo?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredTransactions?.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleCloseModal = () => {
    setOpenViewModal(false);
  };
  const handleOpenModal = (transactionId: number) => {
    setOpenViewModal(true);
    setTransactionId(transactionId);
  };

  const handleDeleteConfirmation = (id: number) => {
    setTransactionToDelete(id);
  };

  const handleCancelDelete = () => {
    setTransactionToDelete(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id);
      toast.success("Transaction deleted successfully");
      setTransactionToDelete(null);
    } catch (error) {
      console.error("Error deleting Transaction:", error);
      toast.error("Failed to delete Transaction");
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by Transaction Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded m-2"
        />
      </div>
      <Table className="text-left">
        <TableHeader>
          <TableRow>
            <TableHead className="h-10 p-2.5">S.No:</TableHead>
            <TableHead className="h-10 p-2.5">Voucher No.</TableHead>
            <TableHead className="h-10 p-2.5">Voucher Type</TableHead>
            <TableHead className="h-10 p-2.5">Payee</TableHead>
            <TableHead className="h-10 p-2.5">Messer</TableHead>
            <TableHead className="h-10 p-2.5">Entry Date</TableHead>
            <TableHead className="h-10 p-2.5">Status</TableHead>
            <TableHead className="h-10 p-2.5 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems && currentItems.length > 0 ? (
            currentItems?.map((item, index) => (
              <TableRow
                key={item.transactionId}
                className="hover:bg-default-200"
              >
                <TableCell className="p-2.5">{index + 1}</TableCell>
                <TableCell className="p-2.5">{item?.voucherNo}</TableCell>
                <TableCell className="p-2.5">{item?.voucherType}</TableCell>
                <TableCell className="p-2.5">{item?.payee}</TableCell>
                <TableCell className="p-2.5">{item?.messer}</TableCell>
                <TableCell className="p-2.5">
                  {item?.entryDate && format(item.entryDate, "dd-MM-yyyy")}
                </TableCell>
                <TableCell className="p-2.5">{item?.status}</TableCell>
                <TableCell className="p-2.5 flex justify-end">
                  <div className="flex gap-3">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      color="warning"
                      onClick={() => handleOpenModal(item.transactionId!)}
                    >
                      <Icon icon="heroicons:eye" className="h-4 w-4" />
                    </Button>
                    <EditTransaction selectedTransactionDetails={item} />
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      color="secondary"
                      onClick={() =>
                        handleDeleteConfirmation(item.transactionId!)
                      }
                    >
                      <Icon icon="heroicons:trash" className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>No results.</TableCell>
            </TableRow>
          )}
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

      {TransactionToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(TransactionToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
      {openViewModal && (
        <TransactionDetailsDialog
          selectedTransactionDetails={
            (transactionId &&
              filteredTransactions.find(
                (item) => item.transactionId === transactionId
              )?.transactionDetail) ||
            []
          }
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default TransactionListTable;
