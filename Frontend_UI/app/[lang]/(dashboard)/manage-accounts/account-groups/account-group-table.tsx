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

import EditAccountGroup from "./edit-account-group";
import ConfirmationDialog from "../../common/confirmation-dialog";
import { AccountGroupData, useDeleteAccountGroupMutation } from "@/services/apis/accountGroupService";

interface AccountGroupListTableProps {
  accountGroups: AccountGroupData[];
}

const AccountGroupListTable: React.FC<AccountGroupListTableProps> = ({
  accountGroups,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [accountGroupToDelete, setAccountGroupToDelete] = useState<
    number | null
  >(null);
  const itemsPerPage = 8;

  const [deleteAccountGroup] = useDeleteAccountGroupMutation();

  // Apply search filter and pagination
  const filteredAccountGroups = (accountGroups ?? []).filter(
    (accountGroup) =>
      accountGroup?.accountGroupName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      accountGroup?.accountGroupCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      accountGroup?.normalBalance
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAccountGroups.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredAccountGroups?.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDeleteConfirmation = (id: number) => {
    setAccountGroupToDelete(id);
  };

  const handleCancelDelete = () => {
    setAccountGroupToDelete(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAccountGroup(id);
      toast.success("Account Group deleted successfully");
      setAccountGroupToDelete(null);
    } catch (error) {
      console.error("Error deleting AccountGroup:", error);
      toast.error("Failed to delete AccountGroup");
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
            <TableHead className="h-10 p-2.5">Account Group Code</TableHead>
            <TableHead className="h-10 p-2.5">Account Group Name</TableHead>
            <TableHead className="h-10 p-2.5">Normal Balance</TableHead>
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
                {item.accountGroupCode.substring(0, 2).toUpperCase()}
              </TableCell>

              <TableCell className="p-2.5">{item.accountGroupName}</TableCell>
              <TableCell className="p-2.5"> {item.normalBalance}</TableCell>
              <TableCell className="p-2.5">
                {item?.createdAt
                  ? formatDate(item.createdAt)
                  : "No Created Date"}
              </TableCell>
              <TableCell className="p-2.5 flex justify-center">
                <div className="flex gap-3">
                  <EditAccountGroup accountGroupData={item} />
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() =>
                      handleDeleteConfirmation(item.accountGroupId!)
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
      {accountGroupToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(accountGroupToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default AccountGroupListTable;
