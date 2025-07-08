"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import ConfirmationDialog from "../common/confirmation-dialog";
import { FeedbackData, useDeleteParentFeedbackMutation } from "@/services/apis/parentFeedbackService";

interface FeedbackListTableProps {
  feedbacks: FeedbackData[];
  refetch: () => void;
}

const FeedbackListTable: React.FC<FeedbackListTableProps> = ({ feedbacks, refetch }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackToDelete, setFeedbackToDelete] = useState<number | null>(null);
  const itemsPerPage = 10;

  const [deleteFeedback] = useDeleteParentFeedbackMutation();



  // Apply search filter and pagination
  const filteredFeedbacks = feedbacks?.filter(
    (fb) =>
      fb.feedbackText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.dateSubmitted?.toString().includes(searchQuery)
  );

  const currentItems = filteredFeedbacks?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredFeedbacks?.length / itemsPerPage);

  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleDelete = async (id: number) => {
    try {
      await deleteFeedback(id);
      toast.success("Feedback deleted successfully");
      setFeedbackToDelete(null);
      refetch();
    } catch (error) {
      toast.error("Failed to delete feedback");
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search Feedback.."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded m-2"
        />
      </div>

      <Table className="text-left">
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Parent Name</TableHead>
            <TableHead>Feedback</TableHead>
            <TableHead>Date Submitted</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems?.map((item) => (
            <TableRow key={item.parentFeedbackId}>
              <TableCell>{item.studentName}</TableCell>
              <TableCell>{item.parentName}</TableCell>
              <TableCell>{item.feedbackText}</TableCell>
              <TableCell>{item.dateSubmitted?.toString() ?? "N/A"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    color="destructive"
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    onClick={() => setFeedbackToDelete(item?.parentFeedbackId ?? 0)}
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

   
    
      {feedbackToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(feedbackToDelete)}
          onCancel={() => setFeedbackToDelete(null)}
        />
      )}
    </>
  );
};

export default FeedbackListTable;
