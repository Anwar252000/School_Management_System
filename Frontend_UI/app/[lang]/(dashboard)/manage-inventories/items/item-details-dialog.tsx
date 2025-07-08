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
import { InventoryItemData } from "@/services/apis/inventoryItemService";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { InventoryStatusData } from "@/services/apis/inventoryStatusService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import ItemStatusUpdateDropdown from "./item-status-update-dropdown";

interface ConfirmationDialogProps {
  itemDetails: InventoryItemData[];
  status: InventoryStatusData[];
  onClose: () => void;
}

const ItemDetailsDialog: React.FC<ConfirmationDialogProps> = ({
  itemDetails,
  status,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  const filteredItems = (itemDetails ?? []).filter(
    (item) =>
      item?.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.statusName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.tagNumber?.toLowerCase().includes(searchQuery.toLowerCase())
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
          Item Details
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
              <TableHead className="h-10 p-2.5">Item Name</TableHead>
              <TableHead className="h-10 p-2.5">Tag Number</TableHead>
              <TableHead className="h-10 p-2.5">Created Date</TableHead>
              <TableHead className="h-10 p-2.5">Status</TableHead>
              <TableHead className="h-10 p-2.5">Update Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.map((item) => {
              // Define status colors and determine the color index dynamically
              const statusColors: Array<
                "success" | "warning" | "destructive" | "info"
              > = ["success", "warning", "destructive", "info"];
              const colorIndex = item.statusName
                ? item.statusName.length % statusColors.length // Use length mod 4 to cycle through colors
                : 0; // Default to index 0 if no statusName

              return (
                <TableRow
                  key={item.itemId}
                  className="hover:bg-default-200 text-center"
                >
                  <TableCell className="p-2.5">
                    {filteredItems.indexOf(item) + 1}
                  </TableCell>
                  <TableCell className="p-2.5">{item.itemName}</TableCell>
                  <TableCell className="p-2.5">
                    {item.categoryName?.slice(0, 2).toLocaleUpperCase()}
                    {item?.createdAt &&
                      formatDate(item.createdAt).replace(/\//g, "")}
                    -{item.tagNumber}
                  </TableCell>
                  <TableCell className="p-2.5">
                    {item?.createdAt && formatDate(item.createdAt)}
                  </TableCell>
                  <TableCell className="p-2.5">
                    <Badge variant="outline" color={statusColors[colorIndex]}>
                      {item.statusName || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ItemStatusUpdateDropdown
                      itemDetailId={item.itemDetailId!}
                      status={status}
                    />
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

export default ItemDetailsDialog;
