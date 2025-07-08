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
import {
  useDeleteUserPermissionMutation,
  UserPermissionData,
} from "@/services/apis/userPermissionService";

interface UserPermission {
  permissions: UserPermissionData[];
  refetch: () => void;
}

const UserPermissionListTable: React.FC<UserPermission> = ({
  permissions,
  refetch,
}) => {
  const [filteredPermissions, setFilteredPermissions] = useState<
    UserPermissionData[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteUserPermission] = useDeleteUserPermissionMutation();
  const [permissionToDelete, setPermissionToDelete] = useState<number | null>(
    null
  );
  const itemsPerPage = 7;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPermissions?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredPermissions?.length / itemsPerPage);

  useEffect(() => {
    const filtered = permissions.filter(
      (permission) =>
        permission.userName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        permission.roleName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPermissions(filtered);
  }, [searchQuery, permissions]);

  const handleDeleteConfirmation = (id: number) => {
    setPermissionToDelete(id);
  };

  const handleCancelDelete = () => {
    setPermissionToDelete(null);
  };
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  const handleDelete = async (id: number) => {
    try {
      await deleteUserPermission(id);
      toast.success("Permission deleted successfully");
      setPermissionToDelete(null);
      refetch();
    } catch (error) {
      console.error("Error deleting user permission:", error);
      toast.error("Failed to delete user permission");
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by user name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <Table className="text-left">
        <TableHeader>
          <TableRow>
            <TableHead className="h-10 p-2.5">User Name</TableHead>
            <TableHead className="h-10 p-2.5">Role Name</TableHead>
            <TableHead className="h-10 p-2.5">Entities</TableHead>
            {/* <TableHead className="h-10 p-2.5">Permissions</TableHead> */}
            <TableHead className="h-10 p-2.5 text-end">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems?.map((item) => (
            <TableRow key={item.permissionId} className="hover:bg-default-200">
              <TableCell className="p-2.5">{item.userName}</TableCell>
              <TableCell className="p-2.5">{item.roleName}</TableCell>
              <TableCell className="p-2.5">{item.entity}</TableCell>
              {/* <TableCell className="p-2.5">
                <div className="flex gap-2">
                  {item.canCreate && <Badge variant="outline">Create</Badge>}
                  {item.canRead && <Badge variant="outline">Read</Badge>}
                  {item.canUpdate && <Badge variant="outline">Update</Badge>}
                  {item.canDelete && <Badge variant="outline">Delete</Badge>}
                </div>
              </TableCell> */}

              <TableCell className="p-2.5 flex justify-end">
                <div className="flex gap-3">
                  {/* <EditUserPermission userPermissionData={item} /> */}
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() => handleDeleteConfirmation(item.permissionId!)}
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
      {permissionToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(permissionToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default UserPermissionListTable;
