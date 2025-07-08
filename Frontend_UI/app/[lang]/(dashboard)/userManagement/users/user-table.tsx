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
import { Input } from "@/components/ui/input";
import ConfirmationDialog from "../../common/confirmation-dialog";
import EditUser from "./edit-user";
import { toast } from "sonner";
import { useDeleteUserMutation, UserData } from "@/services/apis/userService";
import { UserRoleData } from "@/services/apis/userRoleService";

interface UserListTableProps {
  users: UserData[];
  userRole: UserRoleData[];
  refetch: () => void;
}

const UserListTable: React.FC<UserListTableProps> = ({
  users,
  userRole,
  refetch,
}) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [deleteUser] = useDeleteUserMutation();
  const itemsPerPage = 20;

  // Apply search filter and pagination
  const filteredUsers = (users as any[]).filter((user) =>
    user?.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDeleteConfirmation = (id: number) => {
    setUserToDelete(id);
  };

  const handleCancelDelete = () => {
    setUserToDelete(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      toast.success("User deleted successfully");
      setUserToDelete(null);
      refetch();
    } catch (error) {
      console.error("Error deleting User:", error);
      toast.error("Failed to delete User");
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
          placeholder="Search by User Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded m-2"
        />
      </div>
      <Table className="text-left">
        <TableHeader>
          <TableRow>
            <TableHead className="h-10 p-2.5">User Name</TableHead>
            <TableHead className="h-10 p-2.5">User Role</TableHead>
            <TableHead className="h-10 p-2.5">Campus Name</TableHead>
            <TableHead className="h-10 p-2.5">Created Date</TableHead>
            <TableHead className="h-10 p-2.5">status</TableHead>
            <TableHead className="h-10 p-2.5 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.map((item) => (
            <TableRow
              key={item.userId}
              className="hover:bg-default-200"
              data-state={selectedRows.includes(item.userId!) && "selected"}
            >
              <TableCell className="p-2.5">{item.userName}</TableCell>
              <TableCell className="p-2.5">{item.roleName}</TableCell>
              <TableCell className="p-2.5"> {item.campusName}</TableCell>
              <TableCell className="p-2.5">
                {" "}
                {formatDate(item.createdAt)}
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
              <TableCell className="p-2.5 flex justify-end">
                <div className="flex gap-3">
                  <EditUser
                    userData={item}
                    userRole={userRole}
                    refetch={refetch}
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() => handleDeleteConfirmation(item.userId!)}
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
      {userToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(userToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default UserListTable;
