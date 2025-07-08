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
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

import EditAccountGroup from "./edit-parent-account";
import ConfirmationDialog from "../../common/confirmation-dialog";
import { ParentAccountData, useDeleteParentAccountMutation } from "@/services/apis/parentAccountService";
import EditParentAccount from "./edit-parent-account";

interface ParentAccountListTableProps {
  parentAccounts: ParentAccountData[];
}

const ParentAccountListTable: React.FC<ParentAccountListTableProps> = ({
  parentAccounts,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [parentAccountToDelete, setParentAccountToDelete] = useState<
    number | null
  >(null);
  const itemsPerPage = 8;

  const [deleteParentAccount] = useDeleteParentAccountMutation();

  // Apply search filter and pagination
  const filteredParentAccount = (parentAccounts ?? []).filter(
    (parentAccounts) =>
      parentAccounts?.parentAccountName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parentAccounts?.parentAccountCode?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      parentAccounts?.accountGroupId?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredParentAccount.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredParentAccount?.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDeleteConfirmation = (id: number) => {
    setParentAccountToDelete(id);
  };

  const handleCancelDelete = () => {
    setParentAccountToDelete(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteParentAccount(id);
      toast.success("Parent Account deleted successfully");
      setParentAccountToDelete(null);
    } catch (error) {
      console.error("Error deleting Parent Account:", error);
      toast.error("Failed to delete Parent Account");
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
          placeholder="Search by Account Group Name or Code"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded m-2"
        />
      </div>
      <Table className="text-left">
        <TableHeader>
          <TableRow>
            <TableHead className="h-10 p-2.5">Parent Account Code</TableHead>
            <TableHead className="h-10 p-2.5">Parent Account Name</TableHead>
            <TableHead className="h-10 p-2.5">Account Group Name</TableHead>
            <TableHead className="h-10 p-2.5">Created Date</TableHead>
            <TableHead className="h-10 p-2.5 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.map((item) => (
            <TableRow
              key={item.accountGroupId}
              className="hover:bg-default-200"
              // data-state={selectedRows.includes(item.accountGroupId!) && "selected"}
            >
              <TableCell className="p-2.5">
                {item.parentAccountCode}
              </TableCell>

              <TableCell className="p-2.5">{item.parentAccountName}</TableCell>
              <TableCell className="p-2.5"> {item.accountGroupName}</TableCell>
              <TableCell className="p-2.5">
                {item?.createdAt
                  ? formatDate(item.createdAt)
                  : "No Created Date"}
              </TableCell>
              <TableCell className="p-2.5 flex justify-center">
                <div className="flex gap-3">
                  <EditParentAccount parentAccountData={item} />
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() =>
                      handleDeleteConfirmation(item.parentAccountId!)
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
      {parentAccountToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(parentAccountToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default ParentAccountListTable;
