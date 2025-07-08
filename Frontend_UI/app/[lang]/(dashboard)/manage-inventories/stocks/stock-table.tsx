"use client";
import React, { useState } from "react";
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

// import EditItem from "./edit-stock";
import {
  InventoryStockData,
  useDeleteInventoryStockMutation,
  useFetchInventoryStocksByItemIdQuery,
} from "@/services/apis/inventoryStockService";
import { InventoryItemData } from "@/services/apis/inventoryItemService";
import { InventoryStatusData } from "@/services/apis/inventoryStatusService";
import { Icon } from "@iconify/react";
import StockDetailsDialog from "./stock-details-dialog";

interface StockListTableProps {
  stocks: InventoryStockData[];
  items: InventoryItemData[];
  status: InventoryStatusData[];
}

const StockListTable: React.FC<StockListTableProps> = ({
  stocks,
  items,
  status,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const stocksPerPage = 8;
  const [openViewModal, setOpenViewModal] = useState<Boolean>(false);
  const [itemId, setItemId] = useState<number | null>(null);
  const { data: stockDetails } = useFetchInventoryStocksByItemIdQuery(
    itemId as number,
    {
      skip: itemId === null,
    }
  );
  const stockDetailsData = stockDetails?.data as InventoryStockData[];

  // Apply search filter and pagination
  const filteredStocks = (stocks ?? []).filter(
    (item) =>
      item?.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleCloseModal = () => {
    setOpenViewModal(false);
  };
  const handleOpenModal = (itemId: number) => {
    setOpenViewModal(true);
    setItemId(itemId);
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by Item or Category"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded m-2"
        />
      </div>
      <Table className="text-left">
        <TableHeader>
          <TableRow className="text-center">
            <TableHead className="h-10 p-2.5">Item</TableHead>
            <TableHead className="h-10 p-2.5">Category</TableHead>
            <TableHead className="h-10 p-2.5">Total Stock In</TableHead>
            <TableHead className="h-10 p-2.5">Total Stock Out</TableHead>
            <TableHead className="h-10 p-2.5">Current Stock</TableHead>
            <TableHead className="h-10 p-2.5">Details</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.map((item) => (
            <TableRow
              key={item.itemId}
              className="hover:bg-default-200 text-center"
              // data-state={selectedRows.includes(item.itemId!) && "selected"}
            >
              <TableCell className="p-2.5">{item.itemName}</TableCell>
              <TableCell className="p-2.5">{item.categoryName}</TableCell>
              <TableCell className="p-2.5">{item.totalStockIn}</TableCell>
              <TableCell className="p-2.5">{item.totalStockOut}</TableCell>
              <TableCell className="p-2.5">{item.currentStock}</TableCell>
              <TableCell className="p-2.5 flex justify-center">
                <div className="">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="primary"
                    onClick={() => handleOpenModal(item.itemId!)}
                  >
                    <Icon icon="heroicons:eye" className="h-4 w-4" />
                  </Button>
                </div>
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
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
      {openViewModal && (
        <StockDetailsDialog
          stockDetails={stockDetailsData}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default StockListTable;
