import React, { useState } from "react";
import { toast } from "sonner";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import {
  EmployeeTrainingData,
  useDeleteEmployeeTrainingMutation,
} from "@/services/apis/employeeTrainingService";
import ConfirmationDialog from '../../common/confirmation-dialog'
import { Input } from "@/components/ui/input";
import EditEmployeeTraining from "./edit-employee-training";

type Props = {
  trainings: EmployeeTrainingData[];
  refetch: () => void;
};

const EmployeeTrainingListTable: React.FC<Props> = ({ trainings, refetch }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 50;
  const [trainingToDelete, setTrainingToDelete] = useState<number | null>(null);

  const [deleteTraining] = useDeleteEmployeeTrainingMutation();
  const filteredTrainings = trainings.filter((training) =>
    training.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  training.trainingName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredTrainings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTrainings.length / itemsPerPage);

  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const confirmDelete = (id: number) => setTrainingToDelete(id);
  const cancelDelete = () => setTrainingToDelete(null);



  const handleDelete = async (id: number) => {
    try {
      await deleteTraining(id);
      refetch();
      setTrainingToDelete(null);
      toast.success("Training deleted successfully");
    } catch (error) {
      console.error("Delete training error:", error);
      toast.error("Failed to delete training");
    }
  };

  return (
    <>
     <div className="mb-4 flex justify-between items-center">
            <Input
              type="text"
              placeholder="Search by Employee And Tranining Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
    
      <Table className="text-left">
        <TableHeader>
          
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Training Name</TableHead>
            <TableHead>Training Date</TableHead>
            <TableHead>Certificate</TableHead>
            <TableHead className="text-end">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.map((training) => (
            <TableRow key={training.trainingId} className="hover:bg-default-200">
              <TableCell>{training.employeeName}</TableCell>
              <TableCell>{training.trainingName}</TableCell>
              <TableCell>{training.trainingDate}</TableCell>
              <TableCell>{training.certification || "No Certificate"}</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex gap-3">
                <EditEmployeeTraining training={training} refetch={refetch} />

                    
                  <Button 
                    size="icon"
                    variant="outline"
                    color="destructive"
                    className="h-7 w-7"
                    onClick={() => confirmDelete(training.trainingId!)}
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
        <Button onClick={handlePrevious} disabled={currentPage === 1}>
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={handleNext} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>

      {trainingToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(trainingToDelete)}
          onCancel={cancelDelete}
        />
      )}
    </>
  );
};

export default EmployeeTrainingListTable;
