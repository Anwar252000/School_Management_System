"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { TransactionDetail } from "@/services/apis/transactionService";

interface ConfirmationDialogProps {
  selectedTransactionDetails: TransactionDetail[];
  onClose: () => void;
}

const TransactionDetailsDialog: React.FC<ConfirmationDialogProps> = ({
  selectedTransactionDetails,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  const filteredItems = (selectedTransactionDetails ?? []).filter(
    (item) =>
      item?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item?.creditAmount !== null &&
        item?.creditAmount !== undefined &&
        String(item?.creditAmount).includes(searchQuery)) ||
      (item?.debitAmount !== null &&
        item?.debitAmount !== undefined &&
        String(item?.debitAmount).includes(searchQuery))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredItems?.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Return DD/MM/YYYY format
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="text-base font-normal" size="5xl">
        <DialogTitle className="text-base font-medium">
          Transaction Details
        </DialogTitle>
        <div className="mb-4 flex justify-between items-center">
          <Input
            type="text"
            placeholder="Search Here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded m-2"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="h-10 p-2.5">S. No.</TableHead>
              <TableHead className="h-10 p-2.5">Description</TableHead>
              <TableHead className="h-10 p-2.5">Credit Amount(Cr.)</TableHead>
              <TableHead className="h-10 p-2.5">Debit Amount(Dr.)</TableHead>
              <TableHead className="h-10 p-2.5 text-end">
                Created Date
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems?.map((item) => {
              return (
                <TableRow
                  key={item.transactionDetailId}
                  className="hover:bg-default-200 text-center"
                >
                  <TableCell className="p-2.5">
                    {filteredItems.indexOf(item) + 1}
                  </TableCell>
                  <TableCell className="p-2.5">{item.description}</TableCell>
                  <TableCell className="p-2.5">{item.creditAmount}</TableCell>
                  <TableCell className="p-2.5">{item.debitAmount}</TableCell>
                  <TableCell className="p-2.5">
                    {item?.createdAt && formatDate(item.createdAt)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-4">
          <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailsDialog;
