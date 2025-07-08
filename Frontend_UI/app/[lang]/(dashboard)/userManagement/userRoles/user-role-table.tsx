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
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import ConfirmationDialog from "../../common/confirmation-dialog";
import EditUserRoles from "./edit-user-roles";
import {
  useDeleteUserRoleMutation,
  UserRoleData,
} from "@/services/apis/userRoleService";

interface UserRoleProps {
  userRole: UserRoleData[];
  refetch: () => void;
}
const UserRoleTable: React.FC<UserRoleProps> = ({ userRole, refetch }) => {
  const [filteredRoles, setFilteredRoles] = useState<UserRoleData[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [deleteUserRole] = useDeleteUserRoleMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null);
  const itemsPerPage = 50;

  useEffect(() => {
    const filtered = userRole?.filter((role) =>
      role?.roleName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRoles(filtered);
  }, [searchQuery, userRole]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRoles?.slice(indexOfFirstItem, indexOfLastItem);
  console.log("current Items", userRole);

  const totalPages = Math.ceil(filteredRoles?.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDeleteConfirmation = (id: number) => {
    setRoleToDelete(id);
  };

  const handleCancelDelete = () => {
    setRoleToDelete(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUserRole(id);
      toast.success("Role deleted successfully");
      setRoleToDelete(null);
      refetch();
    } catch (error) {
      console.error("Error deleting Employee Role:", error);
      toast.error("Failed to delete Employee Role");
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by role name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <Table className="text-left">
        <TableHeader>
          <TableRow>
            <TableHead className="h-10 p-2.5">Role Name</TableHead>
            <TableHead className="h-10 p-2.5">Description</TableHead>
            <TableHead className="h-10 p-2.5">Status</TableHead>
            <TableHead className="h-10 p-2.5 text-end">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems &&
            currentItems?.map((item) => (
              <TableRow
                key={item.roleId}
                className="hover:bg-default-200"
                // data-state={selectedRows.includes(item.roleId!) && "selected"}
              >
                <TableCell className="p-2.5">{item.roleName}</TableCell>
                <TableCell className="p-2.5">{item.roleDescription}</TableCell>
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
                    <EditUserRoles userRoleData={item} refetch={refetch} />

                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      color="secondary"
                      onClick={() => handleDeleteConfirmation(item.roleId!)}
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
      {roleToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(roleToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default UserRoleTable;
