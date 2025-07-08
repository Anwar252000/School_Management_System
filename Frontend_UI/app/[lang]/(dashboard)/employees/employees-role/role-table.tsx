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
import EditRoles from "./edit-roles";
import { toast } from "sonner";
import { RoleData, useDeleteRoleMutation } from "@/services/apis/employeeRoleService";
import ConfirmationDialog from "../../common/confirmation-dialog";

interface RoleListTableProps {
  roles: RoleData[];
  refetch: () => void;
}

const RoleListTable: React.FC<RoleListTableProps> = ({ roles, refetch }) => {
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null);
  const itemsPerPage = 50;


  const [deleteRole] = useDeleteRoleMutation();


    const filtered = roles?.filter((role) =>
      role?.roleName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // console.log(filtered,"filtered");
    

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filtered?.length / itemsPerPage);

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
      await deleteRole(id);
      toast.success("Employee deleted successfully");
      setRoleToDelete(null);
      refetch();
    } catch (error) {
      console.error("Error deleting Employee:", error);
      toast.error("Failed to delete Employee");
    }
  };
  const handleRefetch = () => {
    refetch();
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
          {currentItems?.map((item) => (
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
                  <EditRoles rolesData={item} refetch={handleRefetch}/>

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

export default RoleListTable;
