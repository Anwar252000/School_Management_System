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
import ConfirmationDialog from "../../common/confirmation-dialog";
import { ParentAccountData, useDeleteParentAccountMutation } from "@/services/apis/parentAccountService";
import EditParentAccount from "./edit-account";
import { AccountData, useDeleteAccountMutation } from "@/services/apis/accountService";
import EditAccount from "./edit-account";

interface AccountListTableProps {
  accounts: AccountData[];
}

const AccountListTable: React.FC<AccountListTableProps> = ({
  accounts,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [accountToDelete, setAccountToDelete] = useState<
    number | null
  >(null);
  const itemsPerPage = 8;

  const [deleteAccount] = useDeleteAccountMutation();

  // Apply search filter and pagination
  const filteredAccount = (accounts ?? []).filter(
    (accounts) =>
      accounts?.accountName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      accounts?.accountCode?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      accounts?.parentAccountName?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAccount.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredAccount?.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDeleteConfirmation = (id: number) => {
    setAccountToDelete(id);
  };

  const handleCancelDelete = () => {
    setAccountToDelete(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAccount(id);
      toast.success("Controlling Account deleted successfully");
      setAccountToDelete(null);
    } catch (error) {
      console.error("Error deleting Controlling Account:", error);
      toast.error("Failed to delete Controlling Account");
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
            <TableHead className="h-10 p-2.5">Account Code</TableHead>
            <TableHead className="h-10 p-2.5">Account Name</TableHead>
            <TableHead className="h-10 p-2.5">Parent Account Name</TableHead>
            <TableHead className="h-10 p-2.5">Created Date</TableHead>
            <TableHead className="h-10 p-2.5 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.map((item) => (
            <TableRow
              key={item.accountId}
              className="hover:bg-default-200"
              // data-state={selectedRows.includes(item.accountGroupId!) && "selected"}
            >
              <TableCell className="p-2.5">
                {item.accountCode}
              </TableCell>

              <TableCell className="p-2.5">{item.accountName}</TableCell>
              <TableCell className="p-2.5"> {item.parentAccountName}</TableCell>
              <TableCell className="p-2.5">
                {item?.createdAt
                  ? formatDate(item.createdAt)
                  : "No Created Date"}
              </TableCell>
              <TableCell className="p-2.5 flex justify-center">
                <div className="flex gap-3">
                  <EditAccount accountData={[item]} />
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() =>
                      handleDeleteConfirmation(item.accountId!)
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
      {accountToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(accountToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default AccountListTable;
