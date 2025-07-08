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
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import ConfirmationDialog from "../../common/confirmation-dialog";
import {
  InventoryPurchaseData,
  useDeleteInventoryPurchaseMutation,
} from "@/services/apis/inventoryPurchaseService";
import EditPurchase from "./edit-purchase";
import { InventoryItemData } from "@/services/apis/inventoryItemService";
import { log } from "console";

interface PurchaseListTableProps {
  purchases: InventoryPurchaseData[];
  items: InventoryItemData[];
}

const PurchaseListTable: React.FC<PurchaseListTableProps> = ({
  purchases,
  items,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [purchaseToDelete, setPurchaseToDelete] = useState<number | null>(null);
  const itemsPerPage = 20;

  const [deletePurchase] = useDeleteInventoryPurchaseMutation();

  // Apply search filter and pagination
  const filteredPurchases = (purchases ?? []).filter(
    (purchase) =>
      purchase?.supplierName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      purchase?.invoiceNumber
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      purchase?.itemName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPurchases.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredPurchases?.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDeleteConfirmation = (id: number) => {
    setPurchaseToDelete(id);
  };

  const handleCancelDelete = () => {
    setPurchaseToDelete(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePurchase(id);
      toast.success("Purchase deleted successfully");
      setPurchaseToDelete(null);
    } catch (error) {
      toast.error("Failed to delete Purchase");
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
            <TableHead className="h-10 p-2.5">Supplier Name</TableHead>
            <TableHead className="h-10 p-2.5">Item Name</TableHead>
            <TableHead className="h-10 p-2.5">Invoice Number</TableHead>
            <TableHead className="h-10 p-2.5">Quantity</TableHead>
            <TableHead className="h-10 p-2.5">Unit Price</TableHead>
            <TableHead className="h-10 p-2.5">Total Cost</TableHead>
            <TableHead className="h-10 p-2.5">Purchase Date</TableHead>
            <TableHead className="h-10 p-2.5">Status</TableHead>
            <TableHead className="h-10 p-2.5 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.map((item) => (
            <TableRow
              key={item.purchaseId}
              className="hover:bg-default-200"
              // data-state={selectedRows.includes(item.categoryId!) && "selected"}
            >
              <TableCell className="p-2.5">{item.supplierName}</TableCell>
              <TableCell className="p-2.5">{item.itemName}</TableCell>
              <TableCell className="p-2.5"> {item.invoiceNumber}</TableCell>
              <TableCell className="p-2.5"> {item.quantity}</TableCell>
              <TableCell className="p-2.5">
                {" "}
                {item.unitPrice?.toFixed(2)}
              </TableCell>
              <TableCell className="p-2.5">
                {" "}
                {item.totalCost?.toFixed(2)}
              </TableCell>
              <TableCell className="p-2.5">
                {" "}
                {item.purchaseDate
                  ? new Date(item.purchaseDate).toLocaleDateString()
                  : ""}
              </TableCell>
              {/* <TableCell className="p-2.5">
                {item?.createdAt
                  ? formatDate(item.createdAt)
                  : "No Created Date"}
              </TableCell> */}
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
                  <EditPurchase purchaseData={item} items={items} />
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() => handleDeleteConfirmation(item.purchaseId!)}
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
      {purchaseToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(purchaseToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default PurchaseListTable;
