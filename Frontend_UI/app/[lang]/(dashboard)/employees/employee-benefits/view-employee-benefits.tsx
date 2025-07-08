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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  EmployeeBenefitData,
  useDeleteEmployeeBenefitsMutation,
} from "@/services/apis/employeeBenefitsService";
import ConfirmationDialog from "../../common/confirmation-dialog";
import EditEmployeeBenefits from "./edit-employee-benefits";
import { EmployeesData } from "@/services/apis/employeeService";


interface Props {
  employeeBenefits: EmployeeBenefitData[];
  employees: EmployeesData[];
  refetch: () => void;
}

const ViewEmployeeBenefits: React.FC<Props> = ({ employeeBenefits,employees, refetch }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [benefitToDelete, setBenefitToDelete] = useState<number | null>(null);
  const itemsPerPage = 50;

  const [deleteBenefit] = useDeleteEmployeeBenefitsMutation();

  const filtered = employeeBenefits?.filter(
    (benefit) =>
      benefit.benefitType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      benefit.employeeName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered?.length / itemsPerPage);

  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleDeleteConfirmation = (id: number) => setBenefitToDelete(id);
  const handleCancelDelete = () => setBenefitToDelete(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteBenefit(id).unwrap();
      toast.success(" Employee Benefit deleted successfully");
      setBenefitToDelete(null);
      refetch();
    } catch (error) {
      console.error("Error deleting employee benefit:", error);
      toast.error("Failed to delete employee benefit");
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by benefit type or employee name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <Table className="text-left">
        <TableHeader>
          <TableRow>
            <TableHead>Employee Name</TableHead>
            <TableHead>Benefit Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-end">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems?.map((item) => (
            <TableRow key={item.benefitId} className="hover:bg-default-200">
              <TableCell>{item.employeeName}</TableCell>
              <TableCell>{item.benefitType}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex gap-3">
                  <EditEmployeeBenefits benefitData={item} employees={employees} refetch={refetch} />
                  <Button
                    size="icon"
                    variant="outline"
                    color="destructive"
                    className="h-7 w-7"
                    onClick={() => handleDeleteConfirmation(item.benefitId!)}
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

      {benefitToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(benefitToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default ViewEmployeeBenefits;
