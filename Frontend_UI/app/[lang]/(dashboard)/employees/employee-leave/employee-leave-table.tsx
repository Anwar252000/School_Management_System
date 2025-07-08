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
import { toast } from "sonner";
import {
  useDeleteEmployeeLeaveMutation,
  EmployeeLeaveData,
} from "@/services/apis/employeeLeaveService";
import ConfirmationDialog from "../../common/confirmation-dialog";
import EditEmployeeLeave from "./edit-employee-leave";

interface Props {
  leaves: EmployeeLeaveData[];
  refetch: () => void;
}

const EmployeeLeaveListTable: React.FC<Props> = ({ leaves, refetch }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [leaveToDelete, setLeaveToDelete] = useState<number | null>(null);
  const itemsPerPage = 50;

  const [deleteLeave] = useDeleteEmployeeLeaveMutation();

  const filtered = leaves?.filter((leave) =>
    leave.leaveType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    leave.employeeName?.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered?.length / itemsPerPage);

  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleDeleteConfirmation = (id: number) => setLeaveToDelete(id);
  const handleCancelDelete = () => setLeaveToDelete(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteLeave(id);
      toast.success("Leave deleted successfully");
      setLeaveToDelete(null);
      refetch();
    } catch (error) {
      console.error("Error deleting leave:", error);
      toast.error("Failed to delete leave");
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by leave type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <Table className="text-left">
        <TableHeader>
          <TableRow>
          <TableHead>Employee Name</TableHead>
            <TableHead>Leave Type</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-end">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems?.map((item) => (
            <TableRow key={item.employeeLeaveId} className="hover:bg-default-200">
              <TableCell>{item.employeeName}</TableCell>
              <TableCell>{item.leaveType}</TableCell>
              <TableCell>{item.startDate}</TableCell>
              <TableCell>{item.endDate}</TableCell>
              <TableCell>{item.reason}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  color={
                    item.approvalStatus === "Approved"
                      ? "success"
                      : item.approvalStatus === "Pending"
                      ? "warning"
                      : "destructive"
                  }
                  
                  className="capitalize"
                >
                  {item.approvalStatus}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end">
                <div className="flex gap-3">
                  <EditEmployeeLeave leaveData={item} refetch={refetch} />
                  <Button
                    size="icon"
                    variant="outline"
                    color="destructive"
                    className="h-7 w-7"
                    onClick={() => handleDeleteConfirmation(item.employeeLeaveId!)}
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

      {leaveToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(leaveToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default EmployeeLeaveListTable;
