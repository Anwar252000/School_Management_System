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

import EditItem from "./edit-item";
import ConfirmationDialog from "../../common/confirmation-dialog";
import {
  InventoryItemData,
  useDeleteInventoryItemMutation,
  useFetchInventoryItemDetailsByItemIdQuery,
} from "@/services/apis/inventoryItemService";
import { InventoryCategoryData } from "@/services/apis/inventoryCategoryService";
import ItemDetailsDialog from "./item-details-dialog";
import { InventoryStatusData } from "@/services/apis/inventoryStatusService";

interface ItemListTableProps {
  items: InventoryItemData[];
  categories: InventoryCategoryData[];
  status: InventoryStatusData[];
}

const ItemListTable: React.FC<ItemListTableProps> = ({
  items,
  categories,
  status,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [openViewModal, setOpenViewModal] = useState<Boolean>(false);
  const [itemId, setItemId] = useState<number | null>(null);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const itemsPerPage = 8;
  const { data: itemDetails } = useFetchInventoryItemDetailsByItemIdQuery(
    itemId as number,
    {
      skip: itemId === null,
    }
  );
  const itemDetailsData = itemDetails?.data as InventoryItemData[];

  const [deleteItem] = useDeleteInventoryItemMutation();

  // Apply search filter and pagination
  const filteredItems = (items ?? []).filter(
    (item) =>
      item?.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredItems?.length / itemsPerPage);

  const handleCloseModal = () => {
    setOpenViewModal(false);
  };
  const handleOpenModal = (itemId: number) => {
    setOpenViewModal(true);
    setItemId(itemId);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDeleteConfirmation = (id: number) => {
    setItemToDelete(id);
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteItem(id);
      toast.success("Item deleted successfully");
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting Item:", error);
      toast.error("Failed to delete Item");
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
          placeholder="Search by Item Name or Description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded m-2"
        />
      </div>
      <Table className="text-left">
        <TableHeader>
          <TableRow>
            <TableHead className="h-10 p-2.5">Category Code</TableHead>
            <TableHead className="h-10 p-2.5">Category</TableHead>
            <TableHead className="h-10 p-2.5">Item Name</TableHead>
            <TableHead className="h-10 p-2.5">Desccription</TableHead>
            <TableHead className="h-10 p-2.5">Price</TableHead>
            <TableHead className="h-10 p-2.5">Quantity</TableHead>
            <TableHead className="h-10 p-2.5">Total Cost</TableHead>
            <TableHead className="h-10 p-2.5">Created Date</TableHead>
            <TableHead className="h-10 p-2.5">Status</TableHead>
            <TableHead className="h-10 p-2.5 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.map((item) => (
            <TableRow
              key={item.itemId}
              className="hover:bg-default-200"
              // data-state={selectedRows.includes(item.itemId!) && "selected"}
            >
              <TableCell className="p-2.5">
                {item.categoryName?.slice(0, 2).toUpperCase()}
              </TableCell>
              <TableCell className="p-2.5">{item.categoryName}</TableCell>
              <TableCell className="p-2.5">{item.itemName}</TableCell>
              <TableCell className="p-2.5"> {item.description}</TableCell>
              <TableCell className="p-2.5">
                {" "}
                {item.unitPrice.toFixed(2)}
              </TableCell>
              <TableCell className="p-2.5"> {item.totalQuantity}</TableCell>
              <TableCell className="p-2.5">
                {" "}
                {(item.unitPrice * item.totalQuantity).toFixed(2)}
              </TableCell>
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
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="warning"
                    onClick={() => handleOpenModal(item.itemId!)}
                  >
                    <Icon icon="heroicons:eye" className="h-4 w-4" />
                  </Button>
                  <EditItem itemData={item} categories={categories} />
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() => handleDeleteConfirmation(item.itemId!)}
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
      {itemToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(itemToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
      {openViewModal && (
        <ItemDetailsDialog
          itemDetails={itemDetailsData}
          status={status}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ItemListTable;
