"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InventoryStockData } from "@/services/apis/inventoryStockService";
import { useState } from "react";

interface ConfirmationDialogProps {
  stockDetails: InventoryStockData[];
  onClose: () => void;
}

const StockDetailsDialog: React.FC<ConfirmationDialogProps> = ({
  stockDetails,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const stocksPerPage = 5;

  const filteredStocks = (stockDetails ?? []).filter(
    (item) =>
      item?.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.transactionType
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item?.transactionDate
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item?.statusName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * stocksPerPage;
  const indexOfFirstItem = indexOfLastItem - stocksPerPage;
  const currentItems = filteredStocks.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredStocks?.length / stocksPerPage);
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="text-base font-normal" size="5xl">
        <DialogTitle className="text-base font-medium">
          Stock Details
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
        <Table className="text-left">
          <TableHeader>
            <TableRow className="text-center">
              <TableHead className="h-10 p-2.5">Quantity</TableHead>
              <TableHead className="h-10 p-2.5">Transaction Type</TableHead>
              <TableHead className="h-10 p-2.5">Transaction Date</TableHead>
              <TableHead className="h-10 p-2.5">Remarks</TableHead>
              <TableHead className="h-10 p-2.5">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.map((item) => (
              <TableRow
                key={item.stockId}
                className="hover:bg-default-200 text-center"
                // data-state={selectedRows.includes(item.itemId!) && "selected"}
              >
                <TableCell className="p-2.5">{item.quantity}</TableCell>
                <TableCell className="p-2.5">{item.transactionType}</TableCell>
                <TableCell className="p-2.5">
                  {item.transactionDate
                    ? new Date(item.transactionDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )
                    : ""}
                </TableCell>
                <TableCell className="p-2.5">{item.remarks}</TableCell>
                <TableCell className="p-2.5">
                  <Badge
                    variant="outline"
                    color={
                      item.statusName === "Allocated"
                        ? "success"
                        : item.statusName === "Repair"
                        ? "warning"
                        : "default"
                    }
                  >
                    {item.statusName}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between stocks-center mt-4">
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

export default StockDetailsDialog;
