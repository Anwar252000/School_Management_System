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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

import EditPurchase from "./edit-purchase";
import ConfirmationDialog from "../../common/confirmation-dialog";

import {
  BookPurchaseData,
  useDeleteBookPurchaseMutation,
} from "@/services/apis/bookPurchaseService";
import { BookCategoryData } from "@/services/apis/bookCategoryService";

interface PurchaseTableProps {
  purchases: BookPurchaseData[];
}

const PurchaseTable: React.FC<PurchaseTableProps> = ({ purchases }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [purchaseToDelete, setPurchaseToDelete] = useState<number | null>(null);
  const itemsPerPage = 8;

  const [deletePurchase] = useDeleteBookPurchaseMutation();

  const filteredPurchases = (purchases ?? []).filter((purchase) => {
    const bookTitle = purchase.bookTitle
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const purchaseBy = purchase.purchasedBy
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return bookTitle || purchaseBy;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPurchases.slice(0, 3);
  const totalPages = 1;
  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleDeleteConfirmation = (id: number) => setPurchaseToDelete(id);
  const handleCancelDelete = () => setPurchaseToDelete(null);

  const handleDelete = async (id: number) => {
    try {
      await deletePurchase(id).unwrap();
      toast.success("Purchase deleted successfully");
      setPurchaseToDelete(null);
    } catch (error) {
      console.error("Error deleting purchase:", error);
      toast.error("Failed to delete purchase");
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search By Book Name or who purchased..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded m-2"
        />
      </div>

      <Table className="text-left">
        <TableHeader>
          <TableRow>
            <TableHead className="p-2.5">Book Title</TableHead>
            <TableHead className="p-2.5">Purchased By</TableHead>
            <TableHead className="p-2.5">Purchase Date</TableHead>
            <TableHead className="p-2.5">Price</TableHead>
            <TableHead className="p-2.5">Quantity</TableHead>
            <TableHead className="p-2.5">Total Price</TableHead>
            <TableHead className="p-2.5">Status</TableHead>
            <TableHead className="p-2.5 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.map((purchase) => (
            <TableRow
              key={purchase.bookPurchaseId}
              className="hover:bg-default-200"
            >
              <TableCell className="p-2.5">{purchase.bookTitle}</TableCell>
              <TableCell className="p-2.5">{purchase.purchasedBy}</TableCell>
              <TableCell className="p-2.5">
                {purchase.purchaseDate
                  ? formatDate(purchase.purchaseDate)
                  : "N/A"}
              </TableCell>
              <TableCell className="p-2.5">
                {(purchase.price != null ? purchase.price : 0).toFixed(2)}
              </TableCell>
              <TableCell className="p-2.5">{purchase.quantity}</TableCell>
              <TableCell className="p-2.5">
                {(purchase.price * purchase.quantity).toFixed(2)}
              </TableCell>
              <TableCell className="p-2.5">
                <Badge
                  variant="outline"
                  color={purchase.isActive ? "success" : "destructive"}
                  className="capitalize"
                >
                  {purchase.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="p-2.5 flex justify-center">
                <div className="flex gap-3">
                  <EditPurchase purchaseData={purchase} />
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() =>
                      handleDeleteConfirmation(purchase.bookPurchaseId ?? 0)
                    }
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

export default PurchaseTable;
