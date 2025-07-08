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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import EditIssue from "./edit-issue";
import ConfirmationDialog from "../../common/confirmation-dialog";

import {
  IssueData,
  useDeleteIssueMutation,
} from "@/services/apis/issueService";

interface IssueTableProps {
  issues: IssueData[];
}

const IssueTable: React.FC<IssueTableProps> = ({ issues }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [issueToDelete, setIssueToDelete] = useState<number | null>(null);
  const itemsPerPage = 8;

  const [deleteIssue] = useDeleteIssueMutation();

  const filteredIssues = (issues ?? []).filter((issue) => {
    const titleMatch = issue.bookTitle
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const issuedToMatch = issue.issuedTo
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return titleMatch || issuedToMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredIssues.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);

  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleDeleteConfirmation = (id: number) => setIssueToDelete(id);
  const handleCancelDelete = () => setIssueToDelete(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteIssue(id).unwrap();
      toast.success("Issue deleted successfully");
      setIssueToDelete(null);
    } catch (error) {
      console.error("Error deleting issue:", error);
      console.log(issues[0].issuedDate);

      toast.error("Failed to delete issue");
    }
  };

  const formatDate = (dateString: string | Date | undefined | null) => {
    if (!dateString) {
      return new Date().toLocaleDateString();
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return new Date().toLocaleDateString();
    }

    return date.toLocaleDateString();
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by Title or Issued To"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          className="border p-2 rounded m-2"
        />
      </div>

      <Table className="text-left">
        <TableHeader>
          <TableRow>
            {/* Removed Book ID column */}
            <TableHead className="p-2.5">Book Title</TableHead>
            <TableHead className="p-2.5">Issued To</TableHead>
            <TableHead className="p-2.5">Issue Date</TableHead>
            <TableHead className="p-2.5">Advance Payment</TableHead>
            <TableHead className="p-2.5 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.map((issue) => {
            // Debug log to check issuedDate value
            console.log(
              "Issue ID:",
              issue.bookIssueId,
              "Issued Date:",
              issue.issuedDate
            );

            return (
              <TableRow
                key={issue.bookIssueId}
                className="hover:bg-default-200"
              >
                {/* Removed Book ID cell */}
                <TableCell className="p-2.5">{issue.bookTitle}</TableCell>
                <TableCell className="p-2.5">{issue.issuedTo}</TableCell>
                <TableCell className="p-2.5">
                  {formatDate(issue.issuedDate)}
                </TableCell>
                <TableCell className="p-2.5">
                  {(issue.advancePayment ?? 0).toFixed(2)}
                </TableCell>
                <TableCell className="p-2.5 flex justify-center">
                  <div className="flex gap-3">
                    <EditIssue issueData={issue} />
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      color="secondary"
                      onClick={() =>
                        handleDeleteConfirmation(issue.bookIssueId ?? 0)
                      }
                    >
                      <Icon icon="heroicons:trash" className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}

          {currentItems.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="p-4 text-center text-gray-500">
                No issues found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </Button>
      </div>

      {issueToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(issueToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default IssueTable;
