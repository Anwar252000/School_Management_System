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
// import ConfirmationDialog from "../../common/confirmation-dialog";
import {
  AssetAllocationData,
  // useDeleteAllocatedAssetMutation,
} from "@/services/apis/assetsAllocationService";
import EditAllocatedAsset from "./edit-allocated-asset";
import { InventoryItemData } from "@/services/apis/inventoryItemService";
import { InventoryStatusData } from "@/services/apis/inventoryStatusService";

interface AllocatedAssetsTableProps {
  allocatedAssets: AssetAllocationData[];
  items: InventoryItemData[];
  status: InventoryStatusData[];
}

const AllocatedAssetsTable: React.FC<AllocatedAssetsTableProps> = ({
  allocatedAssets,
  items,
  status,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  // const [allocatedAssetToDelete, setAllocatedAssetToDelete] = useState<
  //   number | null
  // >(null);
  const itemsPerPage = 8;

  // const [deleteAllocatedAsset] = useDeleteAllocatedAssetMutation();

  // Apply search filter and pagination
  const filteredAllocatedAssets = (allocatedAssets ?? []).filter(
    (allocatedAsset) =>
      allocatedAsset?.allocatedLocation
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      allocatedAsset?.allocatedByName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      allocatedAsset?.itemName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      allocatedAsset?.allocatedTo
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAllocatedAssets.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredAllocatedAssets?.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // const handleDeleteConfirmation = (id: number) => {
  //   setAllocatedAssetToDelete(id);
  // };

  // const handleCancelDelete = () => {
  //   setAllocatedAssetToDelete(null);
  // };

  // const handleDelete = async (id: number) => {
  //   try {
  //     await deleteAllocatedAsset(id);
  //     toast.success("Asset deleted successfully");
  //     setAllocatedAssetToDelete(null);
  //   } catch (error) {
  //     console.error("Error deleting Asset:", error);
  //     toast.error("Failed to delete Asset");
  //   }
  // };

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
            <TableHead className="h-10 p-2.5">Allocated Items</TableHead>
            <TableHead className="h-10 p-2.5">Allocated To</TableHead>
            <TableHead className="h-10 p-2.5">Allocated Location</TableHead>
            <TableHead className="h-10 p-2.5">Quantity</TableHead>
            <TableHead className="h-10 p-2.5">Allocated By</TableHead>
            <TableHead className="h-10 p-2.5">Allocated Date</TableHead>
            <TableHead className="h-10 p-2.5">Item Status</TableHead>
            <TableHead className="h-10 p-2.5 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.map((item) => (
            <TableRow
              key={item.allocationId}
              className="hover:bg-default-200"
              // data-state={selectedRows.includes(item.categoryId!) && "selected"}
            >
              <TableCell className="p-2.5">{item.itemName}</TableCell>
              <TableCell className="p-2.5"> {item.allocatedTo}</TableCell>
              <TableCell className="p-2.5">{item.allocatedLocation}</TableCell>
              <TableCell className="p-2.5">{item.quantity}</TableCell>
              <TableCell className="p-2.5">{item.allocatedByName}</TableCell>
              <TableCell className="p-2.5">
                {item?.allocationDate
                  ? formatDate(item.allocationDate)
                  : "No Allocated Date"}
              </TableCell>
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
                  className="capitalize"
                >
                  {item.statusName}
                </Badge>
              </TableCell>
              <TableCell className="p-2.5 flex justify-center">
                <div className="flex gap-3">
                  <EditAllocatedAsset
                    allocatedAsset={item}
                    items={items}
                    status={status}
                  />
                  {/* <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() => handleDeleteConfirmation(item.allocationId!)}
                  >
                    <Icon icon="heroicons:trash" className="h-4 w-4" />
                  </Button> */}
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
      {/* {allocatedAssetToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(allocatedAssetToDelete)}
          onCancel={handleCancelDelete}
        />
      )} */}
    </>
  );
};

export default AllocatedAssetsTable;
